"use client";

import { useState, useEffect } from "react";
import RegisterDonorForm from "@/components/donorForm";
import DonationForm from "@/components/donationForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [donors, setDonors] = useState<{ name: string; bloodType: string }[]>(
    []
  );
  const [donations, setDonations] = useState<
    { donorId: number; date: string; bloodUnitId: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Fetch Donors
  const fetchDonors = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/registerDonor");
      const data = await response.json();
      setDonors(data.donors || []);
    } catch (error) {
      console.error("Error fetching donors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Donations
  const fetchDonations = async () => {
    try {
      const response = await fetch("/api/DonationRecord");
      const data = await response.json();
      setDonations(data.donations || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  useEffect(() => {
    fetchDonors();
    fetchDonations();
  }, []);

  // Calculate Blood Type Distribution
  const bloodTypeCount: Record<string, number> = {};
  donors.forEach(({ bloodType }) => {
    bloodTypeCount[bloodType] = (bloodTypeCount[bloodType] || 0) + 1;
  });

  const bloodChartData = Object.keys(bloodTypeCount).map((type) => ({
    bloodType: type,
    count: bloodTypeCount[type],
  }));

  // Calculate Donations Per Blood Type
  const donationBloodTypeCount: Record<string, number> = {};
  donations.forEach(({ bloodUnitId }) => {
    donationBloodTypeCount[bloodUnitId] =
      (donationBloodTypeCount[bloodUnitId] || 0) + 1;
  });

  const donationChartData = Object.keys(donationBloodTypeCount).map((type) => ({
    bloodUnitId: type,
    count: donationBloodTypeCount[type],
  }));

  return (
    <div className="flex flex-col md:flex-row justify-between p-4 gap-4">
      {/* LEFT PANEL */}
      <div className="w-full md:w-1/2">
        <Tabs defaultValue="register">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register Donor</TabsTrigger>
            <TabsTrigger value="donation">Make a Donation</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register Donor</CardTitle>
                <CardDescription>Register a blood donor here</CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterDonorForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="donation">
            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>Make a blood donation here</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT PANEL: STATISTICS */}
      <div className="w-full md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Here are some statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Donors</p>
                <h2 className="text-2xl">{donors.length}</h2>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Donations</p>
                <h2 className="text-2xl">{donations.length}</h2>
              </div>
              <Button onClick={fetchDonors} disabled={loading}>
                {loading ? "Loading..." : "Refresh Data"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BLOOD TYPE CHART */}
        {donors.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Blood Type Distribution</CardTitle>
              <CardDescription>
                Shows the count of each blood type among registered donors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={bloodChartData}>
                  <XAxis dataKey="bloodType" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4C6D07" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* DONATION CHART */}
        {donations.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Donations Per Blood Type</CardTitle>
              <CardDescription>
                Shows the count of donations per blood unit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={donationChartData}>
                  <XAxis dataKey="bloodUnitId" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D72638" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
         {/* LIST OF DONORS */}
         {donors.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Donor List</CardTitle>
              <CardDescription>List of registered donors</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {donors.map((donor, index) => (
                  <li key={index} className="border p-2 rounded-md text-sm">
                    {donor.name} - <span className="text-gray-500">{donor.bloodType}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* LIST OF DONATIONS */}
        {donations.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Donation Records</CardTitle>
              <CardDescription>List of recent blood donations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {donations.map((donation, index) => (
                  <li key={index} className="border p-2 rounded-md text-sm">
                    Donor ID: {donation.donorId} | Date: {donation.date} | Blood Unit:{" "}
                    <span className="text-gray-500">{donation.bloodUnitId}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}