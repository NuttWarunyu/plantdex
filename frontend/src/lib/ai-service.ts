interface ValidationResult {
  isValid: boolean;
  cleanedData: PlantDataRow[];
  validationReport: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  };
  fieldMapping: Record<string, string>;
}

interface PlantDataRow {
  [key: string]: string | number | boolean | null;
}

class AIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async validatePlantData(csvData: PlantDataRow[]): Promise<ValidationResult> {
    try {
      // สร้าง prompt สำหรับ OpenAI
      const prompt = this.createValidationPrompt(csvData);
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // ใช้ GPT-3.5-turbo เพื่อประหยัดค่าใช้จ่าย
          messages: [
            {
              role: 'system',
              content: `คุณเป็น AI ที่เชี่ยวชาญในการตรวจสอบและแก้ไขข้อมูลพืช (Plant Data) 
              หน้าที่ของคุณคือ:
              1. ตรวจสอบความถูกต้องของข้อมูล
              2. แก้ไขข้อมูลที่ผิดพลาด
              3. แนะนำการ map fields
              4. รายงานปัญหาที่พบ
              
              ตอบกลับในรูปแบบ JSON ที่มีโครงสร้างตามที่กำหนด`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2000 // ลด tokens เพื่อประหยัดค่าใช้จ่าย
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const aiResponse = JSON.parse(result.choices[0].message.content);
      
      return this.parseAIResponse(aiResponse, csvData);
      
    } catch (error) {
      console.error('AI validation error:', error);
      return this.createFallbackResult(csvData);
    }
  }

  private createValidationPrompt(csvData: PlantDataRow[]): string {
    const sampleData = csvData.slice(0, 3); // ใช้แค่ 3 แถวแรกเป็นตัวอย่าง
    const headers = Object.keys(csvData[0] || {});
    
    return `
    คุณเป็น AI ที่เชี่ยวชาญในการตรวจสอบข้อมูลพืช CSV กรุณาตรวจสอบและตอบกลับแบบละเอียด

    ข้อมูล CSV ที่ต้องตรวจสอบ:
    
    Headers ที่พบ: ${headers.join(', ')}
    
    Sample Data (3 แถวแรก):
    ${JSON.stringify(sampleData, null, 2)}
    
    ข้อมูลที่ต้องการ (Database Schema):
    - scientific_name (ชื่อวิทยาศาสตร์ - ต้องมี, ไม่ว่าง)
    - common_name_th (ชื่อไทย - ต้องมี, ไม่ว่าง)
    - common_name_en (ชื่ออังกฤษ - ควรมี)
    - category (หมวดหมู่ - ต้องตรงกับ: indoor, outdoor, tropical, succulent, cactus, orchid, herb, tree, shrub, vine, garden, water, rock, border, other)
    - care_level (ระดับการดูแล - ต้องตรงกับ: easy, moderate, difficult)
    - origin_country (ประเทศต้นกำเนิด)
    - description_th (คำอธิบายภาษาไทย)
    - description_en (คำอธิบายภาษาอังกฤษ)
    - care_instructions (คำแนะนำการดูแล)
    - water_needs (ความต้องการน้ำ)
    - light_needs (ความต้องการแสง)
    - humidity_needs (ความต้องการความชื้น)
    - temperature_min (อุณหภูมิต่ำสุด - ต้องเป็นตัวเลข)
    - temperature_max (อุณหภูมิสูงสุด - ต้องเป็นตัวเลข)
    - growth_rate (อัตราการเติบโต)
    - max_height (ความสูงสูงสุด - ต้องเป็นตัวเลข)
    - max_width (ความกว้างสูงสุด - ต้องเป็นตัวเลข)
    - is_poisonous (เป็นพิษหรือไม่ - ต้องเป็น true/false หรือ 1/0)
    - is_rare (หายากหรือไม่ - ต้องเป็น true/false หรือ 1/0)
    - is_trending (เป็นที่นิยมหรือไม่ - ต้องเป็น true/false หรือ 1/0)

    กรุณาตรวจสอบและตอบกลับในรูปแบบ JSON นี้:
    {
      "isValid": boolean,
      "cleanedData": [...],
      "validationReport": {
        "totalRows": number,
        "validRows": number,
        "invalidRows": number,
        "errors": [
          "รายละเอียดข้อผิดพลาดแต่ละรายการ เช่น: Row 1: Missing scientific_name, Row 2: Invalid category 'unknown'"
        ],
        "warnings": [
          "รายละเอียดคำเตือนแต่ละรายการ เช่น: Row 3: common_name_en is empty, Row 5: temperature_min is not a number"
        ],
        "suggestions": [
          "รายละเอียดคำแนะนำแต่ละรายการ เช่น: Map 'plant_name' to 'scientific_name', Convert 'yes/no' to true/false for boolean fields"
        ]
      },
      "fieldMapping": {
        "csv_header": "database_field"
      }
    }

    หมายเหตุ: กรุณาตรวจสอบทุกแถวและให้รายละเอียดข้อผิดพลาด คำเตือน และคำแนะนำที่ชัดเจน
    `;
  }

  private parseAIResponse(aiResponse: Record<string, unknown>, originalData: PlantDataRow[]): ValidationResult {
    try {
      // ใช้ข้อมูลที่ AI แก้ไขแล้ว หรือข้อมูลเดิมถ้า AI ไม่สามารถแก้ไขได้
      const cleanedData = aiResponse.cleanedData || originalData;
      
      const validationReport = aiResponse.validationReport as {
        validRows?: number;
        invalidRows?: number;
        errors?: string[];
        warnings?: string[];
        suggestions?: string[];
      } | undefined;

      return {
        isValid: Boolean(aiResponse.isValid) || false,
        cleanedData: Array.isArray(aiResponse.cleanedData) ? aiResponse.cleanedData as PlantDataRow[] : originalData,
        validationReport: {
          totalRows: originalData.length,
          validRows: validationReport?.validRows || 0,
          invalidRows: validationReport?.invalidRows || originalData.length,
          errors: validationReport?.errors || ['AI validation failed'],
          warnings: validationReport?.warnings || [],
          suggestions: validationReport?.suggestions || []
        },
        fieldMapping: typeof aiResponse.fieldMapping === 'object' && aiResponse.fieldMapping !== null ? aiResponse.fieldMapping as Record<string, string> : {}
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.createFallbackResult(originalData);
    }
  }

  private createFallbackResult(csvData: PlantDataRow[]): ValidationResult {
    return {
      isValid: false,
      cleanedData: csvData,
      validationReport: {
        totalRows: csvData.length,
        validRows: 0,
        invalidRows: csvData.length,
        errors: ['AI validation service unavailable'],
        warnings: ['Please check your data manually'],
        suggestions: ['Verify field names and data types']
      },
      fieldMapping: {}
    };
  }

  async suggestFieldMapping(csvHeaders: string[]): Promise<Record<string, string>> {
    try {
      const prompt = `
      ช่วย map fields จาก CSV headers ไปยัง database fields:
      
      CSV Headers: ${csvHeaders.join(', ')}
      
      Database Fields:
      - scientific_name
      - common_name_th
      - common_name_en
      - category
      - care_level
      - origin_country
      - description_th
      - description_en
      - care_instructions
      - water_needs
      - light_needs
      - humidity_needs
      - temperature_min
      - temperature_max
      - growth_rate
      - max_height
      - max_width
      - is_poisonous
      - is_rare
      - is_trending
      
      ตอบกลับเป็น JSON mapping เท่านั้น:
      {
        "csv_header": "database_field"
      }
      `;

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // ใช้ GPT-3.5-turbo เพื่อประหยัดค่าใช้จ่าย
          messages: [
            {
              role: 'system',
              content: 'คุณเป็น AI ที่ช่วย map fields จาก CSV ไปยัง database schema ตอบกลับเป็น JSON mapping เท่านั้น'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 500 // ลด tokens เพื่อประหยัดค่าใช้จ่าย
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      return JSON.parse(result.choices[0].message.content);
      
    } catch (error) {
      console.error('Field mapping error:', error);
      return {};
    }
  }
}

export default AIService;
export type { ValidationResult, PlantDataRow }; 