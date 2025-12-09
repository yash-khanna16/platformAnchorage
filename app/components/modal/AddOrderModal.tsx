import React, { Dispatch, FormEvent, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import { Modal } from "@mui/material";
import {
    Button,
    DialogTitle,
    Divider,
    ModalDialog,
    Option,
    Select,
    Input,
} from "@mui/joy";
import { AddOrderAdmin, getAllRooms, getBookingForRoom } from '@/app/actions/api';
import AllItemsTable from '../tables/AllItemsTable';
import { Hotel, Person, Note } from '@mui/icons-material';

interface AddOrderModalProps {
    open: boolean
    setAddOrderModal: Dispatch<SetStateAction<boolean>>
    token: string;
    setMessage: Dispatch<SetStateAction<string>>
    setAlert: Dispatch<SetStateAction<boolean>>
}

type RoomType = {
    room: string;
    active: boolean;
}

type BookingType = {
    booking_id: string;
    name: string;
    rank: string;
    company: string;
    email: string;
}

type SelectedItemsType = {
    item_id: string;
    qty: number;
}

function AddOrderModal({ open, setAddOrderModal, token, setMessage, setAlert }: AddOrderModalProps) {

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
    const [bookingLoading, setBookingLoading] = useState<boolean>(false);
    const [allRooms, setAllRooms] = useState<RoomType[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string>("")
    const [remark, setRemark] = useState<string>("");
    const [allBookings, setAllBookings] = useState<BookingType[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null)
    const [selectedItems, setSelectedItems] = useState<SelectedItemsType[]>([])
    const [maxTime, setMaxTime] = useState<number>(0)


    const handleSelectChange = (selectType: string, val: string | BookingType | undefined) => {
        if (selectType === "room" && val != undefined) {
            setSelectedRoom(val as string)
            setSelectedBooking(null)
        }
        if (selectType === "booking" && val != undefined) {
            setSelectedBooking(val as BookingType)
        }
    }

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const result: RoomType[] = await getAllRooms(token);
                setAllRooms(result);
            }
            catch (error: any) {
                console.log(error);
            }
            finally {
                setRoomsLoading(false);
            }
        }
        if (open) {
            setRoomsLoading(true)
            fetchRooms();
        }
    }, [open])

    useEffect(() => {
        const fetchBookingForRoom = async () => {
            try {
                const result: BookingType[] = await getBookingForRoom(token, selectedRoom);
                setAllBookings(result)
            }
            catch (error: any) {
                console.log(error);
            }
            finally {
                setBookingLoading(false)
            }
        }
        if (selectedRoom) {
            setBookingLoading(true)
            fetchBookingForRoom()
        }
    }, [selectedRoom])

    const handleOrderSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setSubmitLoading(true)
        try {
            e.preventDefault();
            const body: { booking_id: string, room: string, email: string, items: SelectedItemsType[], remark: string, created_at: string, status: string, order_id: string, time_to_prepare: number, coupon_id: null, delay: number } = {
                booking_id: selectedBooking!.booking_id,
                room: selectedRoom,
                email: selectedBooking!.email,
                items: selectedItems,
                remark: remark,
                created_at: "",
                status: "Placed",
                order_id: "",
                time_to_prepare: maxTime,
                coupon_id: null,
                delay: 0
            }
            const result = await AddOrderAdmin(token, body)
            setAddOrderModal(false);
            setSelectedRoom("")
            setSelectedBooking(null)
            setSelectedItems([]);
            setMessage(result.message)
            setAlert(true)



        } catch (error) {
            console.log(error)
        }
        finally {
            setSubmitLoading(false)
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => {
                setAddOrderModal(false);
                setSelectedRoom("")
                setSelectedBooking(null)
                setSelectedItems([]);
            }}
        >
            <ModalDialog variant="outlined" size="lg" sx={{ maxWidth: '90vw', width: '1200px' }}>
                <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600, pb: 1 }}>
                    Add New Order
                </DialogTitle>
                <Divider />

                <form onSubmit={handleOrderSubmit} className=' max-h-[80vh] overflow-auto '>

                    {/* Selection Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-[98%] mx-auto">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Hotel fontSize="small" className="text-gray-500" />
                                Room Number
                            </label>
                            <Select
                                placeholder="Select a room"
                                value={selectedRoom}
                                onChange={(_, val) => handleSelectChange("room", val as string | undefined)}
                                disabled={roomsLoading}
                                required
                                size="lg"
                                sx={{
                                    minHeight: '44px',
                                    '&:hover': { borderColor: 'primary.main' }
                                }}
                                slotProps={{
                                    listbox: {
                                        sx: {
                                            maxHeight: 240,
                                            overflowY: "auto",
                                        },
                                    },
                                }}
                            >
                                {allRooms.length > 0 ? (
                                    allRooms.map((data: RoomType) => (
                                        <Option key={data.room} value={data.room}>
                                            Room {data.room}
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled value="">No rooms available</Option>
                                )}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Person fontSize="small" className="text-gray-500" />
                                Guest Booking
                            </label>
                            <Select
                                placeholder="Select a booking"
                                value={selectedBooking}
                                onChange={(_, val) => { handleSelectChange("booking", val as BookingType | undefined) }}
                                disabled={bookingLoading || roomsLoading || !selectedRoom}
                                required
                                size="lg"
                                sx={{
                                    minHeight: '44px',
                                    '&:hover': { borderColor: 'primary.main' }
                                }}
                                slotProps={{
                                    listbox: {
                                        sx: {
                                            maxHeight: 240,
                                            overflowY: "auto",
                                        },
                                    },
                                }}
                            >
                                {allBookings.length > 0 ? (
                                    allBookings.map((data: BookingType, index: number) => (
                                        <Option key={index} value={data} label={`${data.rank} ${data.name}`}>
                                            <div className="flex items-center justify-between w-full py-1">
                                                <div className="font-medium">
                                                    {data.rank} {data.name}
                                                </div>
                                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {data.company}
                                                </div>
                                            </div>
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled value="">
                                        {selectedRoom ? "No bookings for this room" : "Select a room first"}
                                    </Option>
                                )}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Note fontSize="small" className="text-gray-500" />
                                Remark
                            </label>
                            <Input
                                placeholder="Add optional remark..."
                                value={remark}
                                type="text"
                                onChange={(e) => {
                                    if (e) setRemark(e.target.value as string);
                                }}
                                size="lg"
                                sx={{
                                    minHeight: '44px',
                                    '&:hover': { borderColor: 'primary.main' }
                                }}
                            />
                        </div>
                    </div>

                    {/* Items Table */}
                    {selectedBooking && (
                        <div className="border-t pt-6">
                            <AllItemsTable
                                key={selectedBooking.booking_id}
                                bookingId={selectedBooking.booking_id}
                                token={token}
                                setSelectedItems={setSelectedItems}
                                selectedItems={selectedItems}
                                maxTime={maxTime}
                                setMaxTime={setMaxTime}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
                        <Button
                            variant="outlined"
                            color="neutral"
                            size="lg"
                            onClick={() => {
                                setAddOrderModal(false);
                                setSelectedRoom("")
                                setSelectedBooking(null)
                                setSelectedItems([]);
                                setRemark("");
                            }}
                            sx={{ minWidth: '100px' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            color="success"
                            size="lg"
                            loading={submitLoading}
                            disabled={selectedItems.length === 0 || selectedBooking === null || submitLoading}
                            sx={{ minWidth: '120px' }}
                        >
                            Confirm Order
                        </Button>
                    </div>
                </form>

            </ModalDialog>
        </Modal>
    )
}

export default AddOrderModal