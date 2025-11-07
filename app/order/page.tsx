"use client";

import { Container } from 'react-bootstrap';
import OrderMain from "@/components/OrderMain";

export default function OrderMainPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <OrderMain />
            </Container>
        </main>
    );
}