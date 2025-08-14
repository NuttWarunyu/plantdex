export interface CSVParseResult {
  headers: string[];
  data: Record<string, any>[];
  totalRows: number;
  errors: string[];
}

export class CSVParser {
  static async parseFile(file: File): Promise<CSVParseResult> {
    try {
      const text = await file.text();
      return this.parseText(text);
    } catch (error) {
      console.error('Error parsing CSV file:', error);
      return {
        headers: [],
        data: [],
        totalRows: 0,
        errors: [`Failed to parse CSV file: ${error}`]
      };
    }
  }

  static parseText(text: string): CSVParseResult {
    const lines = text.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    
    if (lines.length === 0) {
      return {
        headers: [],
        data: [],
        totalRows: 0,
        errors: ['CSV file is empty']
      };
    }

    // Parse headers
    const headers = this.parseCSVLine(lines[0]);
    
    if (headers.length === 0) {
      return {
        headers: [],
        data: [],
        totalRows: 0,
        errors: ['No headers found in CSV']
      };
    }

    // Parse data rows
    const data: Record<string, any>[] = [];
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        
        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
          continue;
        }

        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || '';
        });
        
        data.push(row);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error}`);
      }
    }

    return {
      headers,
      data,
      totalRows: data.length,
      errors
    };
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result.map(value => value.replace(/^"|"$/g, '').trim());
  }

  static convertToDatabaseFormat(data: Record<string, any>[], fieldMapping: Record<string, string>): Record<string, any>[] {
    return data.map(row => {
      const convertedRow: Record<string, any> = {};
      
      Object.entries(fieldMapping).forEach(([csvHeader, dbField]) => {
        if (row[csvHeader] !== undefined) {
          convertedRow[dbField] = row[csvHeader];
        }
      });
      
      return convertedRow;
    });
  }

  static validateRequiredFields(data: Record<string, any>[], requiredFields: string[]): string[] {
    const errors: string[] = [];
    
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });
    });
    
    return errors;
  }

  static cleanData(data: Record<string, any>[]): Record<string, any>[] {
    return data.map(row => {
      const cleanedRow: Record<string, any> = {};
      
      Object.entries(row).forEach(([key, value]) => {
        if (typeof value === 'string') {
          // Clean string values
          cleanedRow[key] = value.trim();
        } else if (typeof value === 'number') {
          // Validate numeric values
          cleanedRow[key] = isNaN(value) ? 0 : value;
        } else if (typeof value === 'boolean') {
          // Keep boolean values as is
          cleanedRow[key] = value;
        } else {
          // Convert other types to string
          cleanedRow[key] = String(value).trim();
        }
      });
      
      return cleanedRow;
    });
  }
} 