"use client";

import { Container } from 'react-bootstrap';
import WishMain from "@/components/WishMain";

export default function WishMainPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <WishMain />
            </Container>
        </main>
    );
}