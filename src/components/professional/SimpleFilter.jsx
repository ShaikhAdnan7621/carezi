import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function SimpleFilter({
	searchTerm,
	setSearchTerm,
	sortBy,
	setSortBy,
	professionType,
	setProfessionType,
	viewMode,
	setViewMode,
}) {
	return (
		<Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
			<CardContent className="p-6">
				<div className="flex flex-col lg:flex-row gap-4 items-center">
					{/* Search Input */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
						<Input
							placeholder="Search by name, specialty, or keywords..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 h-12 text-lg"
						/>
					</div>

					{/* Basic Filters */}
					<div className="flex items-center gap-3">
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="name">Name</SelectItem>
								<SelectItem value="experience">Experience</SelectItem>
								<SelectItem value="recent">Recently Added</SelectItem>
							</SelectContent>
						</Select>

						<Select value={professionType} onValueChange={setProfessionType}>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Profession Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="doctor">Doctor</SelectItem>
								<SelectItem value="nurse">Nurse</SelectItem>
								<SelectItem value="therapist">Therapist</SelectItem>
								<SelectItem value="specialist">Specialist</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>

						{/* View Mode Toggle */}
						<div className="flex border rounded-lg">
							<Button
								variant={viewMode === "grid" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("grid")}
								className="rounded-r-none"
							>
								Grid
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("list")}
								className="rounded-l-none"
							>
								List
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}