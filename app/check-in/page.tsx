"use client";

import { Container } from 'react-bootstrap';
import CheckInMain from "@/components/CheckInMain";

export default function CheckInMainPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <CheckInMain />
            </Container>
        </main>
    );
}