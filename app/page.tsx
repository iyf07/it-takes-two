"use client"
import { Card, Row, Col, Image } from 'react-bootstrap';
import { CURRENCIES } from "@/lib/data/currency";

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow form">
        <Card.Header className="text-center bg-white border-0">
          <h2 className="fw-bold">It takes two</h2>
        </Card.Header>
      </Card>
    </div>
  );
}
