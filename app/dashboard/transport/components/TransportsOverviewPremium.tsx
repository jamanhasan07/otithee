'use client'
import React from "react";
import { Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function TransportsOverviewPremium() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* Transport Overview Card */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
      >
        {/* Top Row: Icon + Title + Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            <h2 className="font-semibold text-lg">Transport Overview</h2>
          </div>
          <span className="text-xs text-neutral-500">{new Date().toLocaleDateString()}</span>
        </div>

        {/* Bottom Section: Circular Number */}
        <div className="flex justify-center items-center py-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="absolute inset-0 rounded-full border-4 border-blue-300"
            />
            <span className="text-3xl font-bold text-blue-400">12</span>
          </div>
        </div>

        {/* Label */}
        <p className="text-center text-sm text-neutral-500">Active Rides</p>
      </motion.div>

      {/* Ride Booking Card */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Ride Booking</h2>
          <span className="text-xs text-neutral-500">Today</span>
        </div>
        <div className="flex justify-center items-center py-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.06 }} className="absolute inset-0 rounded-full border-4 border-green-300" />
            <span className="text-3xl font-bold text-green-400">34</span>
          </div>
        </div>
        <p className="text-center text-sm text-neutral-500">Total Bookings</p>
      </motion.div>

      {/* Drivers Card */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Drivers</h2>
          <span className="text-xs text-neutral-500">Today</span>
        </div>
        <div className="flex justify-center items-center py-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.06 }} className="absolute inset-0 rounded-full border-4 border-yellow-300" />
            <span className="text-3xl font-bold text-yellow-400">18</span>
          </div>
        </div>
        <p className="text-center text-sm text-neutral-500">Available Drivers</p>
      </motion.div>

      {/* Fleet Card */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Fleet</h2>
          <span className="text-xs text-neutral-500">Updated</span>
        </div>
        <div className="flex justify-center items-center py-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.06 }} className="absolute inset-0 rounded-full border-4 border-purple-300" />
            <span className="text-3xl font-bold text-purple-400">52</span>
          </div>
        </div>
        <p className="text-center text-sm text-neutral-500">Vehicles in Fleet</p>
      </motion.div>
    </div>
  );
}
