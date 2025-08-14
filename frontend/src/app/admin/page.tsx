'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Upload, Database, BarChart3, RefreshCw, CheckCircle, XCircle, AlertTriangle, Brain, FileText, Settings } from 'lucide-react';
import AIService, { ValidationResult } from '../../lib/ai-service';
import { CSVParser, CSVParseResult } from '../../lib/csv-parser';

interface PlantStats {
  total_plants: number;
  category_distribution: Record<string, number>;
  care_level_distribution: Record<string, number>;
  rare_plants: number;
  trending_plants: number;
  database_status: string;
}

interface ImportResult {
  message: string;
  plants_added: number;
  plants_skipped: number;
  total_plants: number;
  status: string;
}

export default function AdminPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [stats, setStats] = useState<PlantStats | null>(null);
  const [isLoadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // AI Validation states
  const [csvData, setCsvData] = useState<CSVParseResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  // AI Service
  const aiService = new AIService(process.env.NEXT_PUBLIC_OPENAI_API_KEY || '');

  const API_BASE_URL = 'https://plantdex-production.up.railway.app';

  // Parse และ validate CSV ด้วย AI
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setValidationResult(null);
    setShowValidation(false);
    
    try {
      // Parse CSV
      const parsedData = await CSVParser.parseFile(file);
      setCsvData(parsedData);
      
      if (parsedData.errors.length > 0) {
        setError(`CSV parsing errors: ${parsedData.errors.join(', ')}`);
        return;
      }
      
      // แสดง validation options
      setShowValidation(true);
      
    } catch (err) {
      setError(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // AI Validation
  const handleAIValidation = async () => {
    if (!csvData) return;
    
    setIsValidating(true);
    setError(null);
    
    try {
      const result = await aiService.validatePlantData(csvData.data);
      setValidationResult(result);
      
      if (result.isValid) {
        // ถ้า validation ผ่าน ให้อัพโหลดเลย
        await uploadValidatedData(result.cleanedData);
      }
      
    } catch (err) {
      setError(`AI validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsValidating(false);
    }
  };

  // อัพโหลดข้อมูลที่ผ่าน validation แล้ว
  const uploadValidatedData = async (cleanedData: any[]) => {
    setUploading(true);
    setError(null);
    
    try {
      // สร้าง FormData จากข้อมูลที่ผ่าน validation
      const csvBlob = new Blob([convertToCSV(cleanedData)], { type: 'text/csv' });
      const csvFile = new File([csvBlob], 'validated_plants.csv', { type: 'text/csv' });
      
      const formData = new FormData();
      formData.append('file', csvFile);

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/plants/import-csv`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImportResult(result);
        fetchStats();
        setShowValidation(false);
      } else {
        const errorData = await response.json();
        setError(`อัพโหลดล้มเหลว: ${errorData.detail || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}`);
      }
    } catch (err) {
      setError(`เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  // แปลงข้อมูลกลับเป็น CSV
  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ];
    
    return csvRows.join('\n');
  };

  // อัพโหลดไฟล์ CSV (legacy function)
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('กรุณาเลือกไฟล์ CSV');
      return;
    }

    setUploading(true);
    setError(null);
    setImportResult(null);

    try {
      // สร้าง FormData
      const formData = new FormData();
      formData.append('file', selectedFile);

      // อัพโหลดไฟล์ไปยัง backend
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/plants/import-csv`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImportResult(result);
        // รีเฟรชสถิติหลังจากอัพโหลด
        fetchStats();
      } else {
        const errorData = await response.json();
        setError(`อัพโหลดล้มเหลว: ${errorData.detail || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}`);
      }
    } catch (err) {
      setError(`เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  // ดึงสถิติข้อมูล
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/plants/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('ไม่สามารถดึงสถิติได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการดึงสถิติ');
    } finally {
      setLoadingStats(false);
    }
  };



  // โหลดสถิติเมื่อเปิดหน้า
  useEffect(() => {
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🌱 PlantDex Admin Panel</h1>
          <p className="text-gray-600 mt-2">จัดการข้อมูลพืชและระบบ</p>
        </div>
        <Button onClick={fetchStats} disabled={isLoadingStats} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingStats ? 'animate-spin' : ''}`} />
          รีเฟรช
        </Button>
      </div>

      {/* สถิติข้อมูล */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            สถิติข้อมูลพืช
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="ml-2">กำลังโหลด...</span>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total_plants}</div>
                <div className="text-sm text-blue-600">พืชทั้งหมด</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.rare_plants}</div>
                <div className="text-sm text-green-600">พืชหายาก</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.trending_plants}</div>
                <div className="text-sm text-purple-600">พืชยอดนิยม</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.keys(stats.category_distribution).length}
                </div>
                <div className="text-sm text-orange-600">หมวดหมู่</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">ไม่สามารถโหลดสถิติได้</div>
          )}
        </CardContent>
      </Card>

      {/* อัพโหลด CSV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            อัพโหลดข้อมูลพืชจาก CSV
          </CardTitle>
          <CardDescription>
            อัพโหลดไฟล์ CSV ที่มีข้อมูลพืช ระบบจะใช้ AI ตรวจสอบและแก้ไขข้อมูลก่อนอัพโหลด
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="flex-1"
            />
            {showValidation && (
              <Button 
                onClick={handleAIValidation} 
                disabled={isValidating}
                className="min-w-[140px] bg-purple-600 hover:bg-purple-700"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    AI กำลังตรวจสอบ...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    AI ตรวจสอบ
                  </>
                )}
              </Button>
            )}
            <Button 
              onClick={handleFileUpload} 
              disabled={!selectedFile || isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  อัพโหลด...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  อัพโหลด
                </>
              )}
            </Button>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              เลือกไฟล์: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          )}

          {/* CSV Preview */}
          {csvData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">CSV Preview</span>
                <Badge variant="secondary" className="text-xs">
                  {csvData.totalRows} แถว, {csvData.headers.length} คอลัมน์
                </Badge>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      {csvData.headers.map((header, index) => (
                        <th key={index} className="px-2 py-1 border border-gray-300 text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.data.slice(0, 3).map((row, rowIndex) => (
                      <tr key={rowIndex} className="bg-white">
                        {csvData.headers.map((header, colIndex) => (
                          <td key={colIndex} className="px-2 py-1 border border-gray-200 text-xs">
                            {row[header] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.data.length > 3 && (
                  <div className="text-center text-xs text-gray-500 mt-2">
                    ... แสดงแค่ 3 แถวแรก จากทั้งหมด {csvData.data.length} แถว
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* AI Validation Result */}
          {validationResult && (
            <Alert className={validationResult.isValid ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
              {validationResult.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              )}
              <AlertDescription>
                <div className="font-medium">
                  {validationResult.isValid ? '✅ AI Validation สำเร็จ' : '⚠️ AI พบปัญหาที่ต้องแก้ไข'}
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <div>📊 จำนวนแถวทั้งหมด: {validationResult.validationReport.totalRows}</div>
                  <div>✅ แถวที่ถูกต้อง: {validationResult.validationReport.validRows}</div>
                  <div>⚠️ แถวที่มีปัญหา: {validationResult.validationReport.invalidRows}</div>
                  
                  {validationResult.validationReport.errors.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium text-red-600">❌ ข้อผิดพลาด:</div>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {validationResult.validationReport.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {validationResult.validationReport.errors.length > 5 && (
                          <li>... และอีก {validationResult.validationReport.errors.length - 5} รายการ</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {validationResult.validationReport.warnings.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium text-yellow-600">⚠️ คำเตือน:</div>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {validationResult.validationReport.warnings.slice(0, 3).map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {validationResult.validationReport.suggestions.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium text-blue-600">💡 คำแนะนำ:</div>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {validationResult.validationReport.suggestions.slice(0, 3).map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {importResult && (
            <Alert className={importResult.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {importResult.status === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                <div className="font-medium">{importResult.message}</div>
                <div className="mt-2 space-y-1 text-sm">
                  <div>✅ เพิ่มพืชใหม่: {importResult.plants_added} ต้น</div>
                  <div>⚠️ ข้ามพืชที่มีอยู่: {importResult.plants_skipped} ต้น</div>
                  <div>📊 รวมพืชในระบบ: {importResult.total_plants} ต้น</div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* การจัดการข้อมูล */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            การจัดการข้อมูล
          </CardTitle>
          <CardDescription>
            จัดการข้อมูลในระบบอย่างระมัดระวัง
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={fetchStats} 
              variant="outline"
              disabled={isLoadingStats}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              รีเฟรชสถิติ
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* หมวดหมู่พืช */}
      {stats?.category_distribution && (
        <Card>
          <CardHeader>
            <CardTitle>หมวดหมู่พืช</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.category_distribution).map(([category, count]) => (
                <Badge key={category} variant="secondary" className="text-sm">
                  {category}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 