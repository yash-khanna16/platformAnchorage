import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Modal } from "@mui/material";
import {
    Button,
    DialogTitle,
    Divider,
    Input,
    ModalDialog,
    Option,
    Select,
} from "@mui/joy";
import { getAllRooms, getBookingForRoom } from '@/app/actions/api';

interface AddOrderModalProps {
    open: boolean
    setAddOrderModal: Dispatch<SetStateAction<boolean>>
    token: string;
}

type RoomType = {
    room: string;
    active: boolean;
}

function AddOrderModal({ open, setAddOrderModal, token }: AddOrderModalProps) {

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
    const [allRooms, setAllRooms] = useState<RoomType[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string>("")


    const handleChangeRoom = (val: string | null) => {
        if (val) {
            setSelectedRoom(val)
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
                const result = await getBookingForRoom(token, selectedRoom);
                console.log(result)
            }
            catch (error: any) {
                console.log(error);
            }

        }
        if (selectedRoom) {

            fetchBookingForRoom()

        }
    }, [selectedRoom])




    const handleOrderSubmit = () => { }
    return (
        <Modal
            open={open}
            onClose={() => {
                setAddOrderModal(false);
                setSelectedRoom("")
            }}
        >
            <ModalDialog variant="outlined" size="lg">
                <DialogTitle>

                    Add Order
                </DialogTitle>
                <Divider />

                <form
                    onSubmit={handleOrderSubmit}
                >
                    <div>Enter the details to continue</div>
                    <div className=' w-[80vw] grid grid-cols-2 my-4'>
                        <div>
                            <label className=''>Room Number</label>
                            <Select
                                placeholder="Select Room"
                                value={selectedRoom}
                                onChange={(_, val) => { handleChangeRoom(val) }}
                                disabled={roomsLoading}
                                required
                                slotProps={{
                                    listbox: {
                                        sx: {
                                            maxHeight: 192,
                                            overflowY: "auto",
                                        },
                                    },
                                }}
                            >
                                {allRooms.length > 0 ? (
                                    allRooms.map((data: RoomType) => (
                                        <Option key={data.room} value={data.room}>
                                            {data.room}
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled value="">No Rooms</Option>
                                )}
                            </Select>
                        </div>


                    </div>
                    <div className="flex gap-x-3 justify-end ml-5">
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => {
                                setAddOrderModal(false);
                                setSelectedRoom("")
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="solid" color="danger" loading={submitLoading}>
                            Confirm
                        </Button>
                    </div>
                </form>

            </ModalDialog>
        </Modal >
    )
}

export default AddOrderModal
