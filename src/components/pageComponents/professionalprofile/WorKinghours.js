"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock } from 'lucide-react'

export default function WorkingHours({ hours, onChange }) {
	const handleWorkingHourChange = (index, field, value, timeSlot = null) => {
		const updatedHours = [...hours]

		if (!updatedHours[index]) {
			updatedHours[index] = {
				day: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"][index],
				isAvailable: false,
				morning: { startTime: "09:00", endTime: "12:00", isActive: false },
				evening: { startTime: "14:00", endTime: "17:00", isActive: false }
			}
		}

		if (timeSlot) {
			// Validate time limits
			if (field === "startTime" || field === "endTime") {
				const time = value
				if (timeSlot === "morning") {
					if (field === "startTime" && time > updatedHours[index].morning.endTime) return
					if (field === "endTime" && (time < updatedHours[index].morning.startTime)) return
				} else if (timeSlot === "evening") {
					if (field === "startTime" && time > updatedHours[index].evening.endTime) return
					if (field === "endTime" && time < updatedHours[index].evening.startTime) return
				}
			}

			updatedHours[index] = {
				...updatedHours[index],
				[timeSlot]: { ...updatedHours[index][timeSlot], [field]: value }
			}
		} else {
			updatedHours[index] = { ...updatedHours[index], [field]: value }
		}

		onChange(updatedHours)
	}

	return (
		<div className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/30 p-6 shadow-sm transition-all hover:shadow-md">
			<div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5" />
			<div className="relative space-y-6">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-rose-100">
						<Clock className="w-5 h-5 text-rose-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-slate-900">Working Hours</h3>
						<p className="text-sm text-slate-600">Set your availability schedule for consultations</p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4">
					{["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
						(day, index) => (
							<div
								key={day}
								className="p-4 border border-rose-100 rounded-xl bg-white/50 hover:bg-rose-50/30 transition-colors"
							>
								<div className="flex items-center gap-3 mb-3">
									<input
										type="checkbox"
										id={`available-${index}`}
										checked={hours?.[index]?.isAvailable || false}
										onChange={(e) => handleWorkingHourChange(index, "isAvailable", e.target.checked)}
										className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
									/>
									<Label
										htmlFor={`available-${index}`}
										className="font-medium capitalize text-sm text-slate-700"
									>
										{day}
									</Label>
								</div>

								{hours?.[index]?.isAvailable && (
									<div className="space-y-3">
										{/* Morning Slot */}
										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												id={`morning-${index}`}
												checked={hours?.[index]?.morning?.isActive || false}
												onChange={(e) => handleWorkingHourChange(index, "isActive", e.target.checked, "morning")}
												className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
											/>
											<Label className="text-sm font-medium text-slate-600 w-16">Morning</Label>
											{hours?.[index]?.morning?.isActive && (
												<div className="flex items-center gap-2 flex-1">
													<Input
														type="time"
														value={hours?.[index]?.morning?.startTime || "09:00"}
														onChange={(e) => handleWorkingHourChange(index, "startTime", e.target.value, "morning")}
														className="h-9 text-sm border-rose-200 focus:border-rose-400 focus:ring-rose-400 bg-white/50"
													/>
													<span className="text-slate-400 text-sm">to</span>
													<Input
														type="time"
														value={hours?.[index]?.morning?.endTime || "12:00"}
														onChange={(e) => handleWorkingHourChange(index, "endTime", e.target.value, "morning")}
														className="h-9 text-sm border-rose-200 focus:border-rose-400 focus:ring-rose-400 bg-white/50"
													/>
												</div>
											)}
										</div>

										{/* Evening Slot */}
										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												id={`evening-${index}`}
												checked={hours?.[index]?.evening?.isActive || false}
												onChange={(e) => handleWorkingHourChange(index, "isActive", e.target.checked, "evening")}
												className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
											/>
											<Label className="text-sm font-medium text-slate-600 w-16">Evening</Label>
											{hours?.[index]?.evening?.isActive && (
												<div className="flex items-center gap-2 flex-1">
													<Input
														type="time"
														value={hours?.[index]?.evening?.startTime || "14:00"}
														onChange={(e) => handleWorkingHourChange(index, "startTime", e.target.value, "evening")}
														className="h-9 text-sm border-rose-200 focus:border-rose-400 focus:ring-rose-400 bg-white/50"
													/>
													<span className="text-slate-400 text-sm">to</span>
													<Input
														type="time"
														value={hours?.[index]?.evening?.endTime || "17:00"}
														onChange={(e) => handleWorkingHourChange(index, "endTime", e.target.value, "evening")}
														className="h-9 text-sm border-rose-200 focus:border-rose-400 focus:ring-rose-400 bg-white/50"
													/>
												</div>
											)}
										</div>
									</div>
								)}

								{!hours?.[index]?.isAvailable && (
									<div className="text-sm text-slate-400 italic">Not available</div>
								)}
							</div>
						)
					)}
				</div>

				<div className="p-4 bg-rose-50/50 rounded-lg border border-rose-100">
					<p className="text-sm text-slate-600 flex items-start gap-2">
						<Clock className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
						<span>
							Set your general availability hours. Clients will see these times when booking consultations.
							You can always adjust specific appointments as needed.
						</span>
					</p>
				</div>
			</div>
		</div>
	)
}
	
