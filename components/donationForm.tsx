"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Donor {
  id: number;
  name: string;
}

export default function DonationForm() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [bloodUnitId, setBloodUnitId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch Donors from API
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch("/api/registerDonor"); // Get donors from API
        const data = await response.json();
        setDonors(data.donors.map((d: { name: string }, i: number) => ({ id: i + 1, name: d.name })));
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };
    fetchDonors();
  }, []);

  // Handle Donation Submission via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonor || !date || !bloodUnitId) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/DonationRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donorId: selectedDonor,
          date,
          bloodUnitId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit donation record");
      }

      alert("Donation recorded successfully!");
      setSelectedDonor(null);
      setDate("");
      setBloodUnitId("");
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("Failed to record donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record a Blood Donation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Donor Dropdown */}
          <Label>Donor</Label>
          <Select onValueChange={(val) => setSelectedDonor(Number(val))} value={selectedDonor?.toString() || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Donor" />
            </SelectTrigger>
            <SelectContent>
              {donors.map((donor) => (
                <SelectItem key={donor.id} value={donor.id.toString()}>
                  {donor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Input */}
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          {/* Blood Unit ID Input */}
          <Label>Blood Unit ID</Label>
          <Input type="text" value={bloodUnitId} onChange={(e) => setBloodUnitId(e.target.value)} placeholder="Enter Blood Unit ID" />

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Recording..." : "Record Donation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}