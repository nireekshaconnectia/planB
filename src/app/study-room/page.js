"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./studyroom.module.css";
import {HiUsers} from "react-icons/hi2";
import {IoIosBriefcase} from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useTranslations} from "next-intl";
import {IoMdArrowBack} from "react-icons/io";
import SelectFirstPage from "@/components/selectFirstPage/SelectFirstPage";
import {SecondarySmButton} from "@/components/buttons/Buttons";
import PopupWrapper from "@/components/popup/popupWrapper";
import ImageSlider from "@/components/ImageSlider/ImageSlider";

const BookStudyRoom = () => {
    const [studyRooms, setStudyRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [availability, setAvailability] = useState(null);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [showFirstPage, setShowFirstPage] = useState(false);
    const router = useRouter();
    const t = useTranslations();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const images = selectedRoom ?. images || [];

    useEffect(() => {
        // const userToken = localStorage.getItem("userToken");
        // if (!userToken) {
        // router.push("/login");
        // return;
        // }

        const fetchRooms = async () => {
            try {
                const res = await fetch(`${
                    process.env.NEXT_PUBLIC_API_URL
                }/rooms`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await res.json();
                if (result.success) {
                    setStudyRooms(result.data.filter((room) => room.isAvailable));
                }
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [router]);

    // Helpers for time handling (HH:mm <-> minutes)
    const timeStrToMinutes = (hhmm) => {
        const [h, m] = hhmm.split(":").map(Number);
        return h * 60 + m;
    };

    const minutesToDate = (minutes) => new Date(1970, 0, 1, Math.floor(minutes / 60), minutes % 60);

    const isoToLocalMinutes = (iso) => {
        // Example: 2025-08-26T10:00:00+03:00 → take HH:MM between 'T' and '+'
        const match = iso.match(/T(\d{2}:\d{2}):\d{2}[+-]\d{2}:\d{2}$/);
        if (match) {
            return timeStrToMinutes(match[1]);
        }
        // Fallback to Date parsing (browser local) if format changes
        const d = new Date(iso);
        return d.getHours() * 60 + d.getMinutes();
    };

    // Fetch availability when room and date selected
    useEffect(() => {
        const loadAvailability = async () => {
            if (!selectedRoom || !date) {
                setAvailability(null);
                return;
            }
            try {
                setAvailabilityLoading(true);
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, "0");
                const d = String(date.getDate()).padStart(2, "0");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${selectedRoom._id}/availability?date=${y}-${m}-${d}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed to load availability');

                const openStartMin = timeStrToMinutes(data.openHours.start);
                const openEndMin = timeStrToMinutes(data.openHours.end);
                const blockedRangesMinutes = (data.blockedRanges || []).map((range) => ({
                    start: timeStrToMinutes(range.startTime),
                    end: timeStrToMinutes(range.endTime),
                    bookingId: range.bookingId
                }));
                setAvailability({
                    timezone: data.timezone,
                    slotIntervalMinutes: data.slotIntervalMinutes || 30,
                    openStartMin,
                    openEndMin,
                    unavailableMinutes: blockedRangesMinutes,
                });
            } catch (e) {
                console.error(e);
                setAvailability(null);
            } finally {
                setAvailabilityLoading(false);
            }
        };

        loadAvailability();
    }, [selectedRoom, date]);

    const getRoomIcon = (name, capacity) => {
        if (name.toLowerCase().includes("conference") || capacity >= 10) 
            return IoIosBriefcase;
        
        return HiUsers;
    };

    const calculateDuration = () => {
        if (!startTime || !endTime) 
            return 0;
        
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);
        const start = startHour + startMin / 60;
        const end = endHour + endMin / 60;
        const duration = end - start;
        return duration >= 1 ? duration : 0; // Allow 1 hour or more
    };

    const handleStartTimeChange = (value) => {
        setStartTime(value);
        const [hour, min] = value.split(":").map(Number);
        const minEndHour = hour + 1;
        const minEndMin = min;
        if (!endTime || parseInt(endTime.split(":")[0]) < minEndHour) {
            const paddedHour = String(minEndHour).padStart(2, "0");
            const paddedMin = String(minEndMin).padStart(2, "0");
            setEndTime(`${paddedHour}:${paddedMin}`);
        }
    };

    const getMinEndTime = () => {
        if (!startTime) {
            return new Date(1970, 0, 1, 10, 0);
        }
        const [h, m] = startTime.split(":").map(Number);
        return new Date(1970, 0, 1, h + 1, m);
    };

    const isWithinOpenHours = (minutes) => {
        if (!availability) return true;
        return minutes >= availability.openStartMin && minutes <= availability.openEndMin;
    };

    const overlapsUnavailable = (startMin, endMin) => {
        if (!availability) return false;
        return availability.unavailableMinutes.some((u) => startMin < u.end && endMin > u.start);
    };

    const startTimeFilter = (dateObj) => {
        if (!availability) return true;
        const candidateMin = dateObj.getHours() * 60 + dateObj.getMinutes();
        if (!isWithinOpenHours(candidateMin)) return false;
        
        // Check if this start time falls within any booked period
        const isBooked = availability.unavailableMinutes.some((u) => {
            return candidateMin >= u.start && candidateMin < u.end;
        });
        
        return !isBooked;
    };

    const endTimeFilter = (dateObj) => {
        if (!availability) return true;
        if (!startTime) return true;
        const endMin = dateObj.getHours() * 60 + dateObj.getMinutes();
        const [sh, sm] = startTime.split(":").map(Number);
        const startMin = sh * 60 + sm;
        
        // Must be at least 1 hour after start
        if (endMin <= startMin + 60) return false;
        
        if (!isWithinOpenHours(endMin)) return false;
        
        // Check if this end time falls within any booked period
        const isBooked = availability.unavailableMinutes.some((u) => {
            return endMin > u.start && endMin <= u.end;
        });
        
        return !isBooked;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const duration = calculateDuration();

        if (!selectedRoom || !date || duration < 1) {
            alert(t("select-valid-room-date-time"));
            return;
        }

        const query = new URLSearchParams({
            roomId: selectedRoom._id,
            roomName: selectedRoom.name,
            date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
            startTime,
            endTime,
            duration: duration.toString(),
            price: (selectedRoom.price * duration).toString()
        });

        router.push(`/checkout?${
            query.toString()
        }`);
    };
    const handleBackClick = () => {
        setShowFirstPage(true);
    };

    return (
        <div>
            <SelectFirstPage isOpen={showFirstPage}
                onClose={
                    () => setShowFirstPage(false)
                }/>

            <div className={
                styles.container
            }>
                <div className={
                    styles.pageHead
                }>
                    <div className={
                        styles.showMenu
                    }>
                        <IoMdArrowBack onClick={handleBackClick}
                            style={
                                {
                                    cursor: "pointer"
                                }
                            }
                            aria-label="Open first page"
                            role="button"
                            tabIndex="0"/>
                    </div>
                    <h1 className={
                        styles.title
                    }>
                        {
                        t("book-a-room")
                    }</h1>
                </div>

                {
                loading ? (
                    <p>{
                        t("loading-rooms")
                    }</p>
                ) : (
                    <div className={
                        styles.grid
                    }>
                        {
                        studyRooms.map((room) => {
                            const Icon = getRoomIcon(room.name, room.capacity);
                            const isSelected = selectedRoom ?. _id === room._id;

                            return (
                                <div key={
                                        room._id
                                    }
                                    onClick={
                                        () => setSelectedRoom(room)
                                    }
                                    className={
                                        `${
                                            styles.roomCard
                                        } ${
                                            isSelected ? styles.selected : ""
                                        }`
                                }>
                                    <div className={
                                        styles.roomContent
                                    }>
                                        <Icon className={
                                            styles.icon
                                        }/>
                                        <h2 className={
                                            styles.roomName
                                        }>
                                            {
                                            t(`${
                                                room.name
                                            }`)
                                        }</h2>
                                        <p className={
                                            styles.capacity
                                        }>
                                            {
                                            t("capacity-text", {
                                                count: room.capacity,
                                                person: room.capacity > 1 ? t("persons") : t("person")
                                            })
                                        } </p>
                                        <p className={
                                            styles.price
                                        }>
                                            {
                                            room.price
                                        }
                                            {
                                            t("price-per-hour")
                                        }</p>
                                        <SecondarySmButton text="Gallery"
                                            onClick={
                                                () => setIsGalleryOpen(true)
                                            }/>
                                    </div>
                                </div>
                            );
                        })
                    } </div>
                )
            }

                {/* Centralized gallery popup to avoid multiple instances/listeners */}
                <PopupWrapper isOpen={isGalleryOpen}
                    onClose={
                        () => setIsGalleryOpen(false)
                    }
                    title={
                        t("gallery")
                }>
                    <ImageSlider images={images}
                        autoPlay={true}
                        autoPlayTime={5000}/>
                </PopupWrapper>

                <form onSubmit={handleSubmit}
                    className={
                        styles.form
                }>
                    <label className={
                        styles.label
                    }>
                        {
                        t("select-date")
                    }:</label>
                    <DatePicker selected={date}
                        onChange={
                            (d) => setDate(d)
                        }
                        dateFormat="yyyy-MM-dd"
                        minDate={
                            new Date()
                        }
                        className={
                            styles.input
                        }
                        placeholderText={
                            t("select-date")
                        }/>

                    <div className={
                        styles.timeRow
                    }>
                        <div>
                            <label className={
                                styles.label
                            }>
                                {
                                t("from")
                            }:</label>
                            <DatePicker selected={
                                    startTime ? new Date(`1970-01-01T${startTime}`) : null
                                }
                                onChange={
                                    (date) => {
                                        const hours = date.getHours().toString().padStart(2, "0");
                                        const mins = date.getMinutes().toString().padStart(2, "0");
                                        handleStartTimeChange(`${hours}:${mins}`);
                                    }
                                }
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption={
                                    t("start-time")
                                }
                                dateFormat="HH:mm"
                                minTime={
                                    availability ? minutesToDate(availability.openStartMin) : new Date(1970, 0, 1, 8, 0)
                                }
                                maxTime={
                                    availability ? minutesToDate(availability.openEndMin) : new Date(1970, 0, 1, 22, 0)
                                }
                                filterTime={startTimeFilter}
                                className={
                                    styles.input
                                }
                                placeholderText={
                                    t("from")
                                }/>
                        </div>
                    <div>
                        <label className={
                            styles.label
                        }>
                            {
                            t("to")
                        }:</label>
                        <DatePicker selected={
                                endTime ? new Date(`1970-01-01T${endTime}`) : null
                            }
                            onChange={
                                (date) => {
                                    const hours = date.getHours().toString().padStart(2, "0");
                                    const mins = date.getMinutes().toString().padStart(2, "0");
                                    setEndTime(`${hours}:${mins}`);
                                }
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption={
                                t("end-time")
                            }
                            dateFormat="HH:mm"
                            minTime={
                                getMinEndTime()
                            }
                            maxTime={
                                availability ? minutesToDate(availability.openEndMin) : new Date(1970, 0, 1, 23, 0)
                            }
                            filterTime={endTimeFilter}
                            className={
                                styles.input
                            }
                            placeholderText={
                                t("to")
                            }/>
                    </div>
            </div>

            {
            calculateDuration() > 0 && (
                <p className={
                    styles.durationInfo
                }>
                    {
                    t("selected-duration")
                }: {
                    calculateDuration()
                }
                    {
                    t("hour")
                }
                    {
                    calculateDuration() > 1 ? "s" : ""
                } </p>
            )
        }

            {
            calculateDuration() === 0 && startTime && endTime && (
                <p className={
                    styles.errorMessage
                }>
                    {
                    t("duration-error")
                }</p>
            )
        }

            <button type="submit"
                className={
                    styles.submitButton
            }>
                {
                t("proceed-to-checkout")
            } </button>
        </form>
    </div>
</div>
    );
};

export default BookStudyRoom;
