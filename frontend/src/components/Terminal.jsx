import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal = ({ isScanning, onScanComplete }) => {
    const [logs, setLogs] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (isScanning) {
            setLogs(['> Initializing OmniGuard Data Engine...', '> Connecting to Apache Parquet Dataset: optimized_trans.parquet', '> Compiling DuckDB SQL Vectors based on AI Rules...']);

            let count = 0;
            const interval = setInterval(() => {
                const transIds = [
                    '84920' + Math.floor(Math.random() * 1000),
                    '31940' + Math.floor(Math.random() * 1000),
                    '66291' + Math.floor(Math.random() * 1000)
                ];
                setLogs(prev => [...prev, `[DuckDB][Core-0] Scanning Transaction_ID: ${transIds[0]}... OK`, `[DuckDB][Core-1] Scanning Transaction_ID: ${transIds[1]}... OK`]);
                count++;
                if (count > 15) {
                    clearInterval(interval);
                    setLogs(prev => [...prev, '> Massive batch scan completed!', '> Terminating local compute clusters.']);
                    setTimeout(() => {
                        if (onScanComplete) onScanComplete();
                    }, 1000);
                }
            }, 150);

            return () => clearInterval(interval);
        } else {
            setLogs(['> Terminal ready. Upload a policy and initiate scan.']);
        }
    }, [isScanning]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <div className="w-full bg-[#050505] rounded-xl border border-surface/50 shadow-2xl overflow-hidden font-mono text-sm mb-8 flex flex-col h-64">
            <div className="bg-surface/80 flex items-center px-4 py-2 border-b border-highlight/20">
                <TerminalIcon className="w-4 h-4 text-textMuted mr-2" />
                <span className="text-textMuted font-sans text-xs font-semibold tracking-wider">SECURE_TERMINAL // DUCKDB_ENGINE</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto w-full">
                {logs.map((log, index) => (
                    <div key={index} className="mb-1 text-textMuted break-words">
                        {log}
                    </div>
                ))}
                {isScanning && (
                    <div className="text-primary animate-pulse w-max">_</div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default Terminal;
