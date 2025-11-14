"use client";

import { Container } from 'react-bootstrap';
import GiftSend from "@/components/GiftSend";

export default function GiftSendPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <GiftSend />
            </Container>
        </main>
    );
}