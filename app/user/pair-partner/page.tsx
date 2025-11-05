"use client";

import { Container } from 'react-bootstrap';
import UserPairPartner from "@/components/UserPairPartner";

export default function UserPairPartnerPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <UserPairPartner />
            </Container>
        </main>
    );
}