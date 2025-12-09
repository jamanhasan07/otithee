"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// shadcn/ui components (adjust imports to your project structure)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


type Room = {
  id: string;
  title: string;
  price: number;
  beds: number;
  guests: number;
  size: number; // square meters
  rating: number;
  img: string;
  amenities: string[];
};

const sampleRooms:Room[] = [
  {
    id: "r1",
    title: "Deluxe Ocean View",
    price: 180,
    beds: 1,
    guests: 2,
    size: 35,
    rating: 4.8,
    img: "https://plus.unsplash.com/premium_photo-1676823553207-758c7a66e9bb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    amenities: ["Free Wi‑Fi", "Breakfast included", "Sea view", "King bed"],
  },
  {
    id: "r2",
    title: "Family Suite",
    price: 260,
    beds: 2,
    guests: 4,
    size: 60,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    amenities: ["2 Bedrooms", "Kitchenette", "Balcony", "City view"],
  },
  {
    id: "r3",
    title: "Studio Garden",
    price: 120,
    beds: 1,
    guests: 2,
    size: 28,
    rating: 4.5,
    img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    amenities: ["Garden access", "Workspace", "Eco friendly"],
  },
];

export default function RoomsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [guestFilter, setGuestFilter] = useState("2");
  const [selectedRoom, setSelectedRoom] = useState <Room | null>(null);

  const filtered = sampleRooms.filter((r) => {
    const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase());
    const fitsGuests = r.guests >= Number(guestFilter);
    return matchesQuery && fitsGuests;
  });

  return (
    <main className="">
      {/* HERO */}
      <section className="mb-8 grid gap-6 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Rooms & Suites</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Hand-picked rooms designed to international standards — curated for comfort, safety, and great
            experiences. Choose dates, filter, and book in a few clicks.
          </p>

          <div className="mt-6 flex gap-3 items-center">
            <Input
              placeholder="Search rooms, e.g. 'ocean' or 'suite'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-sm"
            />

            <Select onValueChange={(v) => setGuestFilter(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 guest</SelectItem>
                <SelectItem value="2">2 guests</SelectItem>
                <SelectItem value="3">3 guests</SelectItem>
                <SelectItem value="4">4 guests</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => { /* integrate search action if needed */ }}>Search</Button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg">
          <motion.div whileHover={{ scale: 1.02 }} className="relative h-56 md:h-44">
            <Image src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa" alt="hero" fill style={{ objectFit: "cover" }} />
          </motion.div>
        </div>
      </section>

      {/* STATS / HIGHLIGHTS */}
      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>International Standards</CardTitle>
            <CardDescription>Sanitized rooms, safety-checked and inspected regularly.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>24/7 Support</CardTitle>
            <CardDescription>Concierge and support always available.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Best Price Guarantee</CardTitle>
            <CardDescription>Competitive rates with transparent fees.</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* ROOM GRID */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Available Rooms</h2>
          <div className="text-sm text-muted-foreground">{filtered.length} options</div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((room) => (
            <article key={room.id} className="group">
              <div className="rounded-xl overflow-hidden shadow-md bg-background">
                <div className="relative h-44">
                  <motion.div  transition={{ type: "spring", stiffness: 300 }}>
                    <Image src={room.img} alt={room.title} fill style={{ objectFit: "cover" }} />
                  </motion.div>

                  <div className="absolute top-3 left-3">
                    <Badge>{room.rating} ★</Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{room.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{room.amenities.slice(0, 2).join(" • ")}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold">${room.price}</div>
                      <div className="text-sm text-muted-foreground">per night</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Badge variant="secondary">{room.beds} bed</Badge>
                    <Badge variant="secondary">{room.guests} guests</Badge>
                    <Badge variant="secondary">{room.size} m²</Badge>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => setSelectedRoom(room)}>View</Button>
                    <Button size="sm" variant="ghost" onClick={() => router.push(`/book/${room.id}`)}>Book</Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ROOM DETAIL DIALOG */}
      <Dialog open={!!selectedRoom} onOpenChange={(open) => { if (!open) setSelectedRoom(null); }}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedRoom?.title}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-md overflow-hidden h-72 relative">
              <Image src={selectedRoom?.img ?? "/images/room1.jpg"} alt="room" fill style={{ objectFit: "cover" }} />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">${selectedRoom?.price} <span className="text-sm font-normal">/ night</span></div>
                  <div className="text-sm text-muted-foreground">Rating: {selectedRoom?.rating} ★</div>
                </div>
                <div>
                  <Badge>{selectedRoom?.guests} guests</Badge>
                </div>
              </div>

              <p className="mt-4 text-muted-foreground">A comfortable room built to international standards, with dedicated staff and contactless options.
              </p>

              <ul className="mt-4 grid gap-2">
                {selectedRoom?.amenities.map((a) => (
                  <li key={a} className="text-sm">• {a}</li>
                ))}
              </ul>

              <div className="mt-6 flex gap-3">
                <Button onClick={() => router.push(`/book/${selectedRoom?.id}`)}>Reserve</Button>
                <Button variant="ghost" onClick={() => setSelectedRoom(null)}>Close</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FOOTER CTA */}
      <section className="mt-12 rounded-xl p-6 bg-gradient-to-r from-slate-50 to-white shadow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Need something special?</h3>
            <p className="text-sm text-muted-foreground">Contact our concierge for group bookings, accessibility requests or tailor-made packages.</p>
          </div>
          <div>
            <Button onClick={() => router.push('/contact')}>Contact concierge</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
