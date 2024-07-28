import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Upload, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [isEnriching, setIsEnriching] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [avgProcessTime, setAvgProcessTime] = useState(0);
  const [error, setError] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    let timer;
    if (isEnriching) {
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isEnriching]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("No file selected");
      return;
    }
    
    if (file.type !== "text/csv") {
      setError("Please upload a CSV file");
      return;
    }

    setError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        
        if (rows.length > 1) {
          const csvHeaders = rows[0];
          setHeaders([...csvHeaders, 'Enriched Description']);
          setCsvData(rows.slice(1));
        } else {
          setError("The CSV file is empty or invalid");
        }
      } catch (err) {
        setError("Error parsing CSV file: " + err.message);
      }
    };

    reader.onerror = () => {
      setError("Error reading file");
    };

    reader.readAsText(file);
  };

  const startEnrichment = async () => {
    setIsEnriching(true);
    setEnrichmentProgress(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setAvgProcessTime(0);
    setError(null);

    const apiKey = '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';

    for (let i = 0; i < csvData.length; i++) {
      const rowStartTime = Date.now();
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: `Describe the location based on this data: ${csvData[i].join(', ')}`
              }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const enrichedDescription = data.content[0].text;
        
        const enrichedRow = [...csvData[i], enrichedDescription];
        setCsvData(prev => {
          const newData = [...prev];
          newData[i] = enrichedRow;
          return newData;
        });

        setEnrichmentProgress(((i + 1) / csvData.length) * 100);
        
        const rowProcessTime = Date.now() - rowStartTime;
        setAvgProcessTime(prev => (prev * i + rowProcessTime) / (i + 1));
      } catch (err) {
        setError(`Error enriching row ${i + 1}: ${err.message}`);
        break;
      }
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

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {csvData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrichment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={startEnrichment} disabled={isEnriching} className="w-full">
                <Upload className="mr-2 h-4 w-4" /> {isEnriching ? 'Enriching...' : 'Start Enrichment'}
              </Button>
              {isEnriching && (
                <Progress value={enrichmentProgress} className="mt-2" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Elapsed Time</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{elapsedTime} seconds</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg. Process Time</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{avgProcessTime.toFixed(2)} ms per row</span>
            </CardContent>
          </Card>
        </div>
      )}

      {csvData.length > 0 && (
        <>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
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
        </>
      )}
    </div>
  );
};

export default Index;
