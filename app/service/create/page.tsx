"use client";

import { Container } from 'react-bootstrap';
import ServiceCreate from "@/components/ServiceCreate";

export default async function ServiceCreatePage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <ServiceCreate />
            </Container>
        </main>
    );
}