"use client";

import { useState } from "react";
import { Button, Modal, Image } from 'react-bootstrap';

export default function PopUpWindow({
    message,
    currencyChanges,
    locationRedir,
}: {
    message: string;
    currencyChanges: Map<string, number>,
    locationRedir?: string;
}) {
    const [show, setShow] = useState(true);

    async function handleRedir() {
        if (locationRedir) {
            location.href = locationRedir;
        } else {
            setShow(false);
        }
    }

    return (
        <Modal show={show} centered>
            <Modal.Header closeButton className="theme-color">
                <Modal.Title>Mihu</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <div className="mb-3">
                    {message}
                </div>
                {Array.from(currencyChanges).map(([imgSrc, value]) => (
                    <div key={imgSrc} className="align-items-center gap-2">
                        <Image
                            src={`${imgSrc}`}
                            width={24}
                            height={24}
                            alt={imgSrc}
                        />
                        {value > 0 ? (<span> +{value}</span>) : <span> {value}</span>}
                        
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={e => handleRedir()} className="theme-color">Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
