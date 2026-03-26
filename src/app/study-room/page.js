"use client";

import React, { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./studyroom.module.css";
import { HiUsers } from "react-icons/hi2";
import { IoIosBriefcase } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslations } from "next-intl";
import SelectFirstPage from "@/components/selectFirstPage/SelectFirstPage";
import { SecondarySmButton, SecondaryButton } from "@/components/buttons/Buttons";
import PopupWrapper from "@/components/popup/popupWrapper";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import Header from "@/components/layout/Header";

// Static room data
const STATIC_ROOMS = [
  {
    _id: "room1",
    name: "Study room 1",
    price: 40,
    capacity: 1,
    isAvailable: true,
    images: [],
  },
  {
    _id: "room2",
    name: "Study room 2",
    price: 55,
    capacity: 2,
    isAvailable: true,
    images: [],
  },
  {
    _id: "room3",
    name: "Meeting room",
    price: 110,
    capacity: 10,
    isAvailable: true,
    images: [],
  },
];

const BookStudyRoom = () => {
    const t = useTranslations();
    const router = useRouter();
    const formRef = useRef(null);

    // --- ORIGINAL LOGIC STATE ---
    const [studyRooms] = useState(STATIC_ROOMS);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [availability, setAvailability] = useState(null);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    
    // --- UI STATE ---
    const [showFirstPage, setShowFirstPage] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);

    // --- LOGIC: AVAILABILITY HANDLING ---
    const timeStrToMinutes = (hhmm) => {
        if (!hhmm) return 0;
        const [h, m] = hhmm.split(":").map(Number);
        return h * 60 + m;
    };

    // Simulate availability check (always available for demo)
    const loadAvailability = async (roomId, dateObj) => {
        if (!roomId || !dateObj) {
            setAvailability(prev => (prev !== null ? null : prev));
            return;
        }

        try {
            setAvailabilityLoading(true);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Set default availability: 9 AM to 9 PM, no blocked ranges
            const openStartMin = 9 * 60; // 9:00 AM
            const openEndMin = 21 * 60;   // 9:00 PM
            
            const newAvailability = {
                openStartMin,
                openEndMin,
                unavailableMinutes: [] // No blocked times
            };
            
            setAvailability(prev =>
                JSON.stringify(prev) === JSON.stringify(newAvailability)
                    ? prev
                    : newAvailability
            );
        } catch (e) {
            console.error("Availability error:", e);
            setAvailability(prev => (prev !== null ? null : prev));
        } finally {
            setAvailabilityLoading(false);
        }
    };

    // Trigger availability check when selected room or date changes
    useState(() => {
        loadAvailability(selectedRoom?._id, date);
    }, [selectedRoom?._id, date?.getTime()]);

    // --- LOGIC: DATEPICKER FILTERS ---
    const startTimeFilter = (dateObj) => {
        if (!availability) return true;
        const candidateMin = dateObj.getHours() * 60 + dateObj.getMinutes();
        const isBooked = availability.unavailableMinutes.some((u) => candidateMin >= u.start && candidateMin < u.end);
        return candidateMin >= availability.openStartMin && candidateMin < availability.openEndMin && !isBooked;
    };

    const endTimeFilter = (dateObj) => {
        if (!availability || !startTime) return true;
        const endMin = dateObj.getHours() * 60 + dateObj.getMinutes();
        const startMin = timeStrToMinutes(startTime);
        const isBooked = availability.unavailableMinutes.some((u) => endMin > u.start && endMin <= u.end);
        // Ensure end time is at least 1 hour after start time and within open hours
        return endMin >= startMin + 60 && endMin <= availability.openEndMin && !isBooked;
    };

    const calculateDuration = () => {
        if (!startTime || !endTime) return 0;
        const start = timeStrToMinutes(startTime);
        const end = timeStrToMinutes(endTime);
        const duration = (end - start) / 60;
        return duration >= 1 ? duration : 0;
    };

    // --- UI HANDLERS ---
    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        // Auto scroll to form on mobile
        if (window.innerWidth < 1024) {
            formRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleOpenGallery = (e, room) => {
        e.stopPropagation();
        setGalleryImages(room.images || []);
        setIsGalleryOpen(true);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
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
        router.push(`/checkout?${query.toString()}`);
    };

    const getRoomIcon = (name, capacity) => {
        return (name.toLowerCase().includes("meeting") || capacity >= 10) ? IoIosBriefcase : HiUsers;
    };

    // Prepare time boundaries for DatePicker to avoid the "Both minTime and maxTime required" error
    const minTimeForEnd = useMemo(() => {
        if (!startTime) return null;
        const [h, m] = startTime.split(":").map(Number);
        return new Date(1970, 0, 1, h + 1, m);
    }, [startTime]);

    const maxTimeLimit = useMemo(() => {
        if (!availability) return new Date(1970, 0, 1, 23, 30);
        const h = Math.floor(availability.openEndMin / 60);
        const m = availability.openEndMin % 60;
        return new Date(1970, 0, 1, h, m);
    }, [availability]);

    return (
        <section className={styles.pageContainer}>
            <Header />
            <SelectFirstPage isOpen={showFirstPage} onClose={() => setShowFirstPage(false)} />

            <div className={styles.titleWrapper}>
                <h1 className={styles.mainTitle}>{t("book-a-room")}</h1>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.desktopSplit}>
                    
                    {/* LEFT COLUMN: ROOM SELECTION */}
                    <div className={styles.roomsColumn}>
                        <div className={styles.roomGrid}>
                            {studyRooms.map((room, idx) => {
                                const Icon = getRoomIcon(room.name, room.capacity);
                                const isSelected = selectedRoom?._id === room._id;
                                return (
                                    <div 
                                        key={room._id}
                                        className={`${styles.roomPill} ${isSelected ? styles.selectedRoom : ""}`}
                                        onClick={() => handleRoomSelect(room)}
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <div className={styles.roomIconContainer}><Icon /></div>
                                        <div className={styles.roomInfo}>
                                            <h3>{t(room.name, { default: room.name })}</h3>
                                            <p>{t("capacity-text", { count: room.capacity, person: room.capacity > 1 ? t("persons") : t("person") })}</p>
                                            <span className={styles.priceTag}>{room.price} {t("price-per-hour")}</span>
                                        </div>
                                        <div className={styles.galleryBtnWrapper}>
                                            <SecondarySmButton 
                                                text={t("gallery")} 
                                                onClick={(e) => handleOpenGallery(e, room)} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: BOOKING FORM */}
                    <div className={styles.formColumn} ref={formRef}>
                        <div className={styles.noteCard}>
                            <h3 className={styles.noteTitle}>{t("reservation_details")}</h3>
                            <form onSubmit={handleSubmit} className={styles.bookingForm}>
                                <div className={styles.formGroup}>
                                    <label className={styles.pillLabel}>{t("select-date")}</label>
                                    <DatePicker 
                                        selected={date} 
                                        onChange={(d) => setDate(d)} 
                                        minDate={new Date()}
                                        className={styles.styledInput}
                                        placeholderText={t("select-date")}
                                    />
                                </div>

                                <div className={styles.timeRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.pillLabel}>{t("from")}</label>
                                        <DatePicker 
                                            selected={startTime ? new Date(`1970-01-01T${startTime}`) : null}
                                            onChange={(date) => setStartTime(`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`)}
                                            showTimeSelect showTimeSelectOnly timeIntervals={30}
                                            dateFormat="HH:mm"
                                            filterTime={startTimeFilter}
                                            className={styles.styledInput}
                                            placeholderText="00:00"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.pillLabel}>{t("to")}</label>
                                        <DatePicker 
                                            selected={endTime ? new Date(`1970-01-01T${endTime}`) : null}
                                            onChange={(date) => setEndTime(`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`)}
                                            showTimeSelect showTimeSelectOnly timeIntervals={30}
                                            dateFormat="HH:mm"
                                            minTime={minTimeForEnd}
                                            maxTime={maxTimeLimit}
                                            filterTime={endTimeFilter}
                                            className={styles.styledInput}
                                            placeholderText="00:00"
                                            disabled={!startTime}
                                        />
                                    </div>
                                </div>

                                {calculateDuration() > 0 && (
                                    <div className={styles.summaryBox}>
                                        <p>{t("selected-duration")}: <strong>{calculateDuration()} {t("hour")}{calculateDuration() > 1 ? "s" : ""}</strong></p>
                                        <p>{t("total")}: <strong>{selectedRoom ? selectedRoom.price * calculateDuration() : 0} QR</strong></p>
                                    </div>
                                )}

                                <SecondaryButton 
                                    text={t("proceed-to-checkout")} 
                                    onClick={handleSubmit} 
                                    disabled={calculateDuration() === 0 || availabilityLoading}
                                    style={{ width: "100%" }}
                                />
                                {availabilityLoading && <p className={styles.loadingTiny}>{t("checking-availability")}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* GALLERY POPUP */}
            <PopupWrapper isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} title={t("gallery")}>
                {galleryImages.length > 0 ? (
                    <ImageSlider images={galleryImages} autoPlay={true} autoPlayTime={5000}/>
                ) : (
                    <div className={styles.noImages}>{t("no_images_available")}</div>
                )}
            </PopupWrapper>
        </section>
    );
};

export default BookStudyRoom;