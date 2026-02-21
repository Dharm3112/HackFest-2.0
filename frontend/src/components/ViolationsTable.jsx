import React, { useState, useRef, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AlertTriangle, CheckCircle, ShieldAlert, X } from 'lucide-react';
import { resolveViolation } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ViolationsTable = ({ data, setViolations }) => {
    const parentRef = useRef(null);
    const [selectedViolation, setSelectedViolation] = useState(null);

    // Escape listener for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedViolation(null);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleAction = async (id, action) => {
        try {
            await resolveViolation(id, action);
            setViolations((prev) =>
                prev.map(v => v.id === id ? { ...v, status: action } : v)
            );
        } catch (err) {
            console.error(err);
            alert('Failed to update violation status.');
        }
    };

    const columns = [
        {
            accessorKey: 'transaction_id',
            header: 'Transaction ID',
            cell: info => <span className="font-mono text-white font-bold">{info.getValue()}</span>,
            size: 150,
        },
        {
            accessorKey: 'policy_name',
            header: 'Policy Source',
            cell: info => <span className="text-textMuted bg-surface/30 px-2 py-1 rounded border border-highlight/10 text-xs">{info.getValue()}</span>,
            size: 150,
        },
        {
            accessorKey: 'rule_overview',
            header: 'Rule Broken',
            cell: info => {
                const ruleInfo = JSON.parse(info.getValue());
                return (
                    <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">{ruleInfo.description}</span>
                        <span className="text-highlight text-xs font-mono truncate max-w-[200px]">{ruleInfo.logic}</span>
                    </div>
                )
            },
            size: 200,
        },
        {
            accessorKey: 'ai_justification',
            header: 'AI Justification',
            cell: info => (
                <div
                    className="max-w-[200px] text-sm text-textMuted italic truncate cursor-pointer hover:text-white transition-colors"
                    onClick={() => setSelectedViolation(info.row.original)}
                >
                    {info.getValue()}
                </div>
            ),
            size: 200,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                if (status === 'pending') {
                    return <span className="flex items-center text-alert font-bold uppercase text-xs tracking-wider"><AlertTriangle className="w-4 h-4 mr-1" /> Pending Review</span>
                } else if (status === 'approved') {
                    return <span className="flex items-center text-green-500 font-bold uppercase text-xs tracking-wider"><CheckCircle className="w-4 h-4 mr-1" /> False Alarm</span>
                } else {
                    return <span className="flex items-center text-red-500 font-bold uppercase text-xs tracking-wider"><ShieldAlert className="w-4 h-4 mr-1" /> Escalated</span>
                }
            },
            size: 150,
        },
        {
            id: 'actions',
            header: 'Remediation',
            size: 200,
            cell: ({ row }) => {
                const v = row.original;
                if (v.status !== 'pending') return <span className="text-textMuted italic text-xs">Resolved</span>;

                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleAction(v.id, 'approved')}
                            className="bg-surface hover:bg-green-600/20 text-textMuted hover:text-green-500 border border-surface hover:border-green-500/50 px-3 py-1 rounded text-xs font-medium transition-all"
                        >
                            Acknowledge
                        </button>
                        <button
                            onClick={() => handleAction(v.id, 'escalated')}
                            className="bg-alert/10 hover:bg-alert text-alert hover:text-white border border-alert hover:border-alert px-3 py-1 rounded text-xs font-bold transition-all shadow-[0_0_10px_rgba(149,82,78,0.2)] hover:shadow-[0_0_15px_rgba(149,82,78,0.6)]"
                        >
                            Freeze
                        </button>
                    </div>
                );
            }
        }
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    // Virtualization setup
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 73, // Approximate row height
        overscan: 10,
    });

    return (
        <>
            <div
                ref={parentRef}
                className="w-full h-[500px] bg-[#0B0B0B] border border-surface/50 rounded-xl shadow-2xl overflow-auto custom-scrollbar relative"
            >
                <table className="w-full text-left border-collapse grid grid-cols-1">
                    <thead className="bg-surface/30 sticky top-0 backdrop-blur-md z-20 grid grid-cols-1 border-b border-surface">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="flex w-full">
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        style={{ width: header.getSize(), flex: `1 0 ${header.getSize()}px` }}
                                        className="p-4 text-xs font-bold text-textMuted uppercase tracking-wider relative"
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map(virtualRow => {
                            const row = rows[virtualRow.index];
                            return (
                                <tr
                                    key={row.id}
                                    className="border-b border-surface/30 hover:bg-surface/10 transition-colors absolute w-full flex items-center bg-[#0B0B0B]"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                        borderLeft: row.original.status === 'pending' ? '3px solid #95524E' : '3px solid transparent'
                                    }}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            style={{ width: cell.column.getSize(), flex: `1 0 ${cell.column.getSize()}px` }}
                                            className="p-4 align-middle"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {data.length === 0 && (
                    <div className="w-full p-12 text-center text-textMuted italic absolute top-12 left-0">
                        No transactions flagged. Upload a policy and scan the database.
                    </div>
                )}
            </div>

            {/* Explainability Modal */}
            <AnimatePresence>
                {selectedViolation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setSelectedViolation(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0B0B0B] border border-highlight/30 rounded-xl shadow-[0_0_50px_rgba(9,5,254,0.15)] max-w-2xl w-full flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-surface flex justify-between items-center bg-surface/20">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 tracking-wide">Explainability View</h3>
                                    <p className="text-textMuted text-xs uppercase tracking-wider font-mono">ID: {selectedViolation.transaction_id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedViolation(null)}
                                    className="p-2 hover:bg-surface rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-textMuted hover:text-white" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Side by side comparison */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-surface/10 border border-surface p-4 rounded-lg">
                                        <h4 className="text-xs text-textMuted uppercase font-bold mb-3 flex items-center"><ShieldAlert className="w-4 h-4 mr-2 text-primary" /> Database Trigger</h4>
                                        <div className="font-mono text-sm text-white bg-[#050505] p-3 rounded border border-surface/50 break-all">
                                            {JSON.parse(selectedViolation.rule_overview).logic}
                                        </div>
                                    </div>

                                    <div className="bg-surface/10 border border-surface p-4 rounded-lg">
                                        <h4 className="text-xs text-textMuted uppercase font-bold mb-3 flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-alert" /> Found Quote</h4>
                                        <div className="text-sm text-highlight italic bg-[#050505] p-3 rounded border border-surface/50 break-words">
                                            "{selectedViolation.ai_justification.split("Source policy quote: '")[1]?.replace(/'$/, '') || "N/A"}"
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs text-textMuted uppercase font-bold mb-2">Full AI Justification</h4>
                                    <p className="text-sm text-white/90 leading-relaxed bg-surface/30 p-4 rounded-lg border border-highlight/10">
                                        {selectedViolation.ai_justification}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 border-t border-surface bg-background flex justify-end space-x-3">
                                {selectedViolation.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleAction(selectedViolation.id, 'approved');
                                                setSelectedViolation(null);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-textMuted hover:text-green-500 border border-surface hover:border-green-500/50 rounded transition-all bg-surface/30"
                                        >
                                            Mark False Alarm
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleAction(selectedViolation.id, 'escalated');
                                                setSelectedViolation(null);
                                            }}
                                            className="px-4 py-2 text-sm font-bold text-white bg-alert hover:bg-alert/80 border border-alert rounded shadow-[0_0_15px_rgba(149,82,78,0.5)] transition-all"
                                        >
                                            Freeze Account
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-textMuted italic text-sm py-2">This violation has already been {selectedViolation.status}.</span>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ViolationsTable;
