interface ValidationResult {
  isValid: boolean;
  cleanedData: any[];
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
  [key: string]: any;
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
          model: 'gpt-4',
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
          max_tokens: 4000
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
    
    return `
    ข้อมูล CSV ที่ต้องตรวจสอบ:
    
    Headers: ${Object.keys(csvData[0] || {}).join(', ')}
    
    Sample Data:
    ${JSON.stringify(sampleData, null, 2)}
    
    ข้อมูลที่ต้องการ:
    - scientific_name (ชื่อวิทยาศาสตร์ - ต้องมี)
    - common_name_th (ชื่อไทย - ต้องมี)
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
    - temperature_min (อุณหภูมิต่ำสุด)
    - temperature_max (อุณหภูมิสูงสุด)
    - growth_rate (อัตราการเติบโต)
    - max_height (ความสูงสูงสุด)
    - max_width (ความกว้างสูงสุด)
    - is_poisonous (เป็นพิษหรือไม่ - boolean)
    - is_rare (หายากหรือไม่ - boolean)
    - is_trending (เป็นที่นิยมหรือไม่ - boolean)
    
    ตอบกลับในรูปแบบ JSON นี้:
    {
      "isValid": boolean,
      "cleanedData": [...],
      "validationReport": {
        "totalRows": number,
        "validRows": number,
        "invalidRows": number,
        "errors": [...],
        "warnings": [...],
        "suggestions": [...]
      },
      "fieldMapping": {...}
    }
    `;
  }

  private parseAIResponse(aiResponse: any, originalData: PlantDataRow[]): ValidationResult {
    try {
      // ใช้ข้อมูลที่ AI แก้ไขแล้ว หรือข้อมูลเดิมถ้า AI ไม่สามารถแก้ไขได้
      const cleanedData = aiResponse.cleanedData || originalData;
      
      return {
        isValid: aiResponse.isValid || false,
        cleanedData,
        validationReport: aiResponse.validationReport || {
          totalRows: originalData.length,
          validRows: 0,
          invalidRows: originalData.length,
          errors: ['AI validation failed'],
          warnings: [],
          suggestions: []
        },
        fieldMapping: aiResponse.fieldMapping || {}
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
          model: 'gpt-4',
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
          max_tokens: 1000
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