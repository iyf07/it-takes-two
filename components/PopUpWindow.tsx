"use client";

import { useState } from "react";
import { Button, Modal } from 'react-bootstrap';

export default function PopUpWindow({
    message,
    locationRedir,
}: {
    message: string;
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
                <Modal.Title>Congratulations</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => handleRedir()} className="theme-color">Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
