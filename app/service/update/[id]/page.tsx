"use client";

import { Container } from 'react-bootstrap';
import ServiceUpdate from "@/components/ServiceUpdate";

export default async function ServiceUpdatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <ServiceUpdate id={id} />
            </Container>
        </main>
    );
}