"use client";

import { Container } from 'react-bootstrap';
import RecordMain from "@/components/RecordMain";

export default function RecordMainPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <RecordMain />
            </Container>
        </main>
    );
}