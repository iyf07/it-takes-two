"use client";

import { Container } from 'react-bootstrap';
import BankMain from "@/components/BankMain";

export default function BankMainPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <BankMain />
            </Container>
        </main>
    );
}