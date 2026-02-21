import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadPolicy } from '../services/api';

const Dropzone = ({ onUploadSuccess }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsHovered(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            await processFile(e.target.files[0]);
        }
    };

    const processFile = async (file) => {
        setIsUploading(true);
        setError(null);
        try {
            const response = await uploadPolicy(file);
            onUploadSuccess(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to upload and parse the policy. Is the backend running?');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full mb-8">
            <motion.div
                whileHover={{ scale: 1.01 }}
                onDragOver={(e) => { e.preventDefault(); setIsHovered(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsHovered(false); }}
                onDrop={handleDrop}
                className={`relative w-full p-12 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 bg-surface/40 backdrop-blur-md cursor-pointer overflow-hidden
          ${isHovered ? 'border-primary bg-surface/70 shadow-[0_0_30px_rgba(9,5,254,0.3)]' : 'border-highlight/50 hover:border-primary'}
        `}
            >
                <input
                    type="file"
                    accept=".md,.txt,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleChange}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <Bot className="w-16 h-16 text-primary mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-white tracking-wide">Gemini 2.5 Flash is Parsing...</h3>
                        <p className="text-textMuted mt-2 text-sm">Extracting logical rules from Document.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-glow/20 shadow-lg border border-highlight/20">
                            <UploadCloud className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Deploy AML Policy</h3>
                        <p className="text-textMuted text-center max-w-md">
                            Drag and drop your regulatory PDF or text file here. The OmniGuard AI Agent will automatically extract the programmable business rules.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 text-alert bg-alert/10 px-4 py-2 rounded-lg border border-alert/30">
                        {error}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Dropzone;
