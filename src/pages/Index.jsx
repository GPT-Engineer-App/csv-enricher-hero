import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [isEnriching, setIsEnriching] = useState(false);
  const rowsPerPage = 10;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.split(','));
      setCsvData(rows);
    };

    reader.readAsText(file);
  };

  const startEnrichment = async () => {
    setIsEnriching(true);
    setEnrichmentProgress(0);

    for (let i = 0; i < csvData.length; i++) {
      // Simulating API call to Claude
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const enrichedRow = [...csvData[i], "Enriched description for row " + (i + 1)];
      setCsvData(prev => {
        const newData = [...prev];
        newData[i] = enrichedRow;
        return newData;
      });

      setEnrichmentProgress(((i + 1) / csvData.length) * 100);
    }

    setIsEnriching(false);
  };

  const paginatedData = csvData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Uploader and Enricher</h1>
      
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      {csvData.length > 0 && (
        <>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                {csvData[0].map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Enriched Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {Math.ceil(csvData.length / rowsPerPage)}</span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(csvData.length / rowsPerPage)))}
              disabled={currentPage === Math.ceil(csvData.length / rowsPerPage)}
            >
              Next
            </Button>
          </div>

          <Button onClick={startEnrichment} disabled={isEnriching} className="mb-4">
            <Upload className="mr-2 h-4 w-4" /> Start Enrichment
          </Button>

          {isEnriching && (
            <Progress value={enrichmentProgress} className="w-full" />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
