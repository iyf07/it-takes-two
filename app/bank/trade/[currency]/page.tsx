import { Container } from 'react-bootstrap';
import BankTrade from "@/components/BankTrade";

export default async function BankTradePage({ params }: { params: Promise<{ currency: string }> }) {
    const { currency } = await params;
    
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <BankTrade currency={decodeURIComponent(currency)} />
            </Container>
        </main>
    );
}