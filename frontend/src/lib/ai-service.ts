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
    คุณเป็น AI ที่เชี่ยวชาญในการจัดฟอร์มข้อมูลพืช CSV ให้ตรงกับ database schema

    ข้อมูล CSV ที่ต้องจัดฟอร์ม:
    
    Headers ที่พบ: ${headers.join(', ')}
    
    Sample Data (3 แถวแรก - ไม่รวม headers):
    ${JSON.stringify(sampleData, null, 2)}
    
    หมายเหตุสำคัญ: 
    - แถวแรกเป็น headers ไม่ใช่ข้อมูล อย่านับเป็นแถวข้อมูล
    - AI ต้องจัดเรียง columns ให้ตรงตามลำดับที่กำหนดใน schema ข้างต้น
    - ข้อมูลที่ส่งกลับต้องมี structure ที่ถูกต้องและพร้อมใช้งาน
    
    ข้อมูลที่ต้องการ (Database Schema - จัดเรียงตามลำดับที่ต้องการ):
    
    REQUIRED FIELDS (ต้องมี):
    1. scientific_name (ชื่อวิทยาศาสตร์ - ต้องมี, ไม่ว่าง)
    2. common_name_th (ชื่อไทย - ต้องมี, ไม่ว่าง)
    
    CATEGORY & CARE:
    3. category (หมวดหมู่ - ต้องตรงกับ: indoor, outdoor, tropical, succulent, cactus, orchid, herb, tree, shrub, vine, garden, water, rock, border, other)
    4. care_level (ระดับการดูแล - ต้องตรงกับ: easy, moderate, difficult)
    
    DESCRIPTIONS:
    5. description_th (คำอธิบายภาษาไทย - ไม่บังคับ)
    6. description_en (คำอธิบายภาษาอังกฤษ - ไม่บังคับ)
    7. care_instructions (คำแนะนำการดูแล - ไม่บังคับ)
    
    NAMES & ORIGIN:
    8. common_name_en (ชื่ออังกฤษ - ไม่บังคับ)
    9. origin_country (ประเทศต้นกำเนิด - ไม่บังคับ)
    
    CARE REQUIREMENTS:
    10. water_needs (ความต้องการน้ำ - ไม่บังคับ)
    11. light_needs (ความต้องการแสง - ไม่บังคับ)
    12. humidity_needs (ความต้องการความชื้น - ไม่บังคับ)
    
    PHYSICAL PROPERTIES:
    13. temperature_min (อุณหภูมิต่ำสุด - ต้องเป็นตัวเลขหรือ null)
    14. temperature_max (อุณหภูมิสูงสุด - ต้องเป็นตัวเลขหรือ null)
    15. growth_rate (อัตราการเติบโต - ไม่บังคับ)
    16. max_height (ความสูงสูงสุด - ต้องเป็นตัวเลขหรือ null)
    17. max_width (ความกว้างสูงสุด - ต้องเป็นตัวเลขหรือ null)
    
    BOOLEAN FLAGS:
    18. is_poisonous (เป็นพิษหรือไม่ - ต้องเป็น true/false, 1/0, หรือ null)
    19. is_rare (หายากหรือไม่ - ต้องเป็น true/false, 1/0, หรือ null)
    20. is_trending (เป็นที่นิยมหรือไม่ - ต้องเป็น true/false, 1/0, หรือ null)

    หมายเหตุ:
    - ฟิลด์ที่ "ต้องมี" คือ scientific_name และ common_name_th เท่านั้น
    - ฟิลด์อื่นๆ ไม่บังคับ สามารถเป็น null หรือค่าว่างได้
    - ฟิลด์ตัวเลข (temperature, height, width) ต้องเป็นตัวเลขหรือ null
    - ฟิลด์ boolean (is_poisonous, is_rare, is_trending) ต้องเป็น true/false, 1/0, หรือ null

    กรุณาจัดฟอร์มข้อมูลและตอบกลับในรูปแบบ JSON นี้:
    {
      "isValid": boolean,
      "cleanedData": [...],
      "validationReport": {
        "totalRows": number,
        "validRows": number,
        "invalidRows": number,
        "errors": [
          "รายละเอียดข้อผิดพลาดที่แก้ไขไม่ได้ เช่น: Row 1: Cannot determine scientific_name from available data"
        ],
        "warnings": [
          "รายละเอียดการแปลงข้อมูล เช่น: Row 3: Converted 'True' to 'true', Row 5: Mapped 'plant_name' to 'scientific_name'"
        ],
        "suggestions": [
          "รายละเอียดการปรับปรุงข้อมูล เช่น: Filled missing common_name_en with 'N/A', Converted temperature strings to numbers"
        ]
      },
      "fieldMapping": {
        "csv_header": "database_field"
      }
    }

    หมายเหตุ: 
    - กรุณาจัดฟอร์มข้อมูลทุกแถวให้ตรงกับ database schema ข้างต้น
    - แถวแรกเป็น headers ไม่ใช่ข้อมูล อย่านับเป็นแถวข้อมูล
    - จัดฟอร์มข้อมูลให้อัตโนมัติ: แปลง types, map fields, เติมข้อมูลที่ขาด
    - ถ้า scientific_name ว่าง ให้เติมด้วยชื่อวิทยาศาสตร์ที่เหมาะสมจากข้อมูลที่มี
    - แปลง boolean fields จาก 'True'/'False' เป็น 'true'/'false'
    - แปลง string numbers เป็น number types
    - จัดเรียง columns ตามลำดับที่กำหนดใน schema ข้างต้น
    - validationReport.totalRows ควรเป็นจำนวนแถวข้อมูลจริง (ไม่รวม headers)
    - เป้าหมาย: ส่งข้อมูลที่พร้อมใช้งานกลับมา ไม่ใช่แค่รายงานปัญหา
    - ข้อมูลที่ส่งกลับต้องมี columns ครบตาม schema และเรียงลำดับถูกต้อง
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