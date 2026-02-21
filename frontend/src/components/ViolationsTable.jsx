import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { resolveViolation } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ViolationsTable = ({ data, setViolations }) => {
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
        },
        {
            accessorKey: 'policy_name',
            header: 'Policy Source',
            cell: info => <span className="text-textMuted bg-surface/30 px-2 py-1 rounded border border-highlight/10 text-xs">{info.getValue()}</span>,
        },
        {
            accessorKey: 'rule_overview',
            header: 'Rule Broken',
            cell: info => {
                const ruleInfo = JSON.parse(info.getValue());
                return (
                    <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">{ruleInfo.description}</span>
                        <span className="text-highlight text-xs font-mono truncate max-w-xs">{ruleInfo.logic}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'ai_justification',
            header: 'AI Justification',
            cell: info => (
                <div className="max-w-sm text-sm text-textMuted italic relative group cursor-pointer">
                    <div className="truncate">
                        {info.getValue()}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-72 bg-surface border border-highlight/30 p-2 rounded shadow-xl text-xs z-50 overflow-hidden break-words whitespace-pre-wrap">
                        {info.getValue()}
                    </div>
                </div>
            ),
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
        },
        {
            id: 'actions',
            header: 'Remediation',
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
                            Freeze Account
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

    return (
        <div className="w-full bg-[#0B0B0B] border border-surface/50 rounded-xl shadow-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface/30 sticky top-0 backdrop-blur-md z-20">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="p-4 text-xs font-bold text-textMuted uppercase tracking-wider border-b border-surface">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    <AnimatePresence>
                        {table.getRowModel().rows.map(row => (
                            <motion.tr
                                key={row.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-b border-surface/30 hover:bg-surface/10 transition-colors"
                                // Adding a subtle red left border if pending
                                style={{ borderLeft: row.original.status === 'pending' ? '3px solid #95524E' : '3px solid transparent' }}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="p-4 align-top border-b border-surface/10">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="p-12 text-center text-textMuted italic">
                                No transactions flagged. Upload a policy and scan the database.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ViolationsTable;
