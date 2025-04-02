"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaXmark } from "react-icons/fa6";
import { createPortal } from 'react-dom';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    actions?: React.ReactNode;
    isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({
     title,
     onClose,
     children,
     actions,
     isOpen,
     ...rest
 }) => {
    const [isMounted, setIsMounted] = useState(false);
    const modalRoot = useRef<HTMLElement | null>(null);

    useEffect(() => {
        setIsMounted(true);
        modalRoot.current = document.createElement('div');
        document.body.appendChild(modalRoot.current);

        return () => {
            if (modalRoot.current) {
                document.body.removeChild(modalRoot.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isOpen && modalRoot.current) {
            document.body.style.overflow = 'hidden';
        } else if (!isOpen && modalRoot.current) {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    if (!isMounted || !isOpen || !modalRoot.current) {
        return null;
    }

    return createPortal(
        <>
            <div className="fixed top-0 bottom-0 right-0 left-0 blur-sm backdrop-blur-sm z-10" />
            <div className="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center z-20 fade-appear fade-appear-active">
                <div
                    className="relative border border-primary px-10 py-5 rounded-2xl shadow-main w-full max-w-[825px] max-h-[700px] h-full bg-secondary flex flex-col bg-white rounded"
                    {...rest}
                >
                    <div className="flex justify-between align-items-center mb-3">
                        {title && (
                            <h4 className="text-3xl font-medium truncate text-black" dangerouslySetInnerHTML={{ __html: title }} />
                        )}
                        <button className="p-1 flex top-4 right-4" onClick={handleClose}>
                            <FaXmark className="text-xl" color="black" />
                        </button>
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="flex-1">
                            {children}
                        </div>
                        {actions && (
                            <div>
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>,
        modalRoot.current
    );
};

export default Modal;