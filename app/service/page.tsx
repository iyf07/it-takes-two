"use client";

import { Container } from 'react-bootstrap';
import ServiceMain from "@/components/ServiceMain";

export default function ServiceMainPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <ServiceMain />
            </Container>
        </main>
    );
}