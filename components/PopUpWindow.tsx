"use client";

import { useState } from "react";
import { Button, Modal } from 'react-bootstrap';

export default function PopUpWindow(message: string) {
    const [show, setShow] = useState(true);
    return (
        <Modal show={show} centered>
            <Modal.Header closeButton className="theme-color">
                <Modal.Title>It takes two</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {message}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)} className="theme-color">Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
