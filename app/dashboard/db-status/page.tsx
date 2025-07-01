"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DbStatusPage() {
  const [db, setDb] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDb() {
      try {
        const res = await fetch('/api/db/status');
        const data = await res.json();
        setDb(data);
      } catch {
        setDb(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDb();
    const interval = setInterval(fetchDb, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Database Server Status & Performance</h1>
      {loading ? (
        <div>Loading...</div>
      ) : db && db.status === 'ok' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold">{db.connectionCount ?? '-'}</span>
                <span className="text-xs text-muted-foreground mt-2">Active Connections</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Table Open Cache</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-24 mx-auto">
                <CircularProgressbar
                  value={db.tableCacheEfficiency ?? 0}
                  text={`${db.tableCacheEfficiency ?? 0}%`}
                  styles={buildStyles({
                    pathColor: '#22c55e',
                    textColor: '#22c55e',
                  })}
                />
              </div>
              <div className="text-xs text-center mt-2">Efficiency</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>InnoDB Buffer Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-24 mx-auto">
                <CircularProgressbar
                  value={db.innodbBufferUsage ?? 0}
                  text={`${db.innodbBufferUsage ?? 0}%`}
                  styles={buildStyles({
                    pathColor: '#3b82f6',
                    textColor: '#3b82f6',
                  })}
                />
              </div>
              <div className="text-xs text-center mt-2">Usage</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>SQL Statements Executed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {db.sqlStatements ? Object.entries(db.sqlStatements).map(([type, val]) => (
                  <div key={type} className="bg-muted rounded px-2 py-1 text-xs">
                    <span className="font-bold mr-1">{type.toUpperCase()}</span>{val}/s
                  </div>
                )) : <span>-</span>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Network Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <span className="text-green-600 font-bold">
                  Receiving: {typeof db.networkIn === 'number' ? (db.networkIn / 1024).toFixed(2) : '-'} KB/s
                </span>
                <span className="text-orange-600 font-bold mt-1">
                  Sending: {typeof db.networkOut === 'number' ? (db.networkOut / 1024).toFixed(2) : '-'} KB/s
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Query Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <span className="text-2xl font-bold">{db.queryTimeMs} ms</span>
                <div className="text-xs text-muted-foreground mt-2">Last API Query</div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-red-600">Failed to load DB status</div>
      )}
    </div>
  );
}
