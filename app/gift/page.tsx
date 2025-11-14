"use client";

import { Container } from 'react-bootstrap';
import GiftMain from "@/components/GiftMain";

export default function GiftMainPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <GiftMain />
            </Container>
        </main>
    );
}