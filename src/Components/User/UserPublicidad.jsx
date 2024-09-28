"use client"
import React from 'react'
import { useRef } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { GetFeturedListingsApi, getAddedPropertiesApi, GetAnunciosById, AddAnuncio } from "@/store/actions/campaign";
import toast from "react-hot-toast";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import ReactPagination from "@/Components/Pagination/ReactPagination.jsx";
import Loader from "@/Components/Loader/Loader";
import { FaCrown } from "react-icons/fa";
import { placeholderImage, translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import Image from "next/image";
import dynamic from "next/dynamic.js";
import { userSignUpData, loginLoaded } from '@/store/reducer/authSlice';
import { Modal } from "antd";


const VerticleLayout = dynamic(() => import('../../../src/Components/AdminLayout/VerticleLayout.jsx'), { ssr: false })


const UserPublicidad = () => {
    const limit = 8;

    const [Data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;
    const lang = useSelector(languageData);
    const [showAddModal, setShowAddModal] = useState(false);

    const [anounce, setAnounce] = useState({
        titulo: '',
        imagen: '',
        link  : ''
    });

    const userData = useSelector(userSignUpData);
    const user = userData?.data?.data

    useEffect(() => { }, [lang]);

    // api call
    useEffect(() => {
        setIsLoading(true);
        GetAnunciosById({
            user_id: user?.id,
            onSuccess: (response) => {
                setTotal(response.total);
                const DataPub = response.data;
                setIsLoading(false);
                setData(DataPub);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        })

    }, [offsetdata, isLoggedIn, user]);

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };

    const close = async () => {
        setShowAddModal(false);
    };


    const Anounce = {
        titulo : (event) => { setAnounce({...anounce, titulo:event?.target?.value});  },
        imagen : (event) => { setAnounce({...anounce, imagen:event?.target?.files});  },
        link   : (event) => { setAnounce({...anounce, link:event?.target?.value});  },
        save   : (event) => {

            setIsLoading(true);

            AddAnuncio({
                titulo: anounce?.titulo,
                imagen: anounce.imagen,
                link  : anounce?.link,
                onSuccess: (response) => {
                    console.log(response);
                    setIsLoading(false);
                },
                onError: (error) => {
                    setIsLoading(false);
                    console.log(error);
                }
            })
        }
    }


    return (
        <VerticleLayout>
            <div className="container">
                <div className="tranction_title lateral_button">
                    <h1>{translate("myPubs")}</h1> <button class="btn black_button" onClick={() => setShowAddModal(true)}>Nuevo anuncio</button>
                </div>

                <div className="table_content card bg-white">
                    <TableContainer
                        component={Paper}
                        sx={{
                            background: "#fff",
                            padding: "10px",
                        }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="caption table">
                            <TableHead
                                sx={{
                                    background: "#f5f5f5",
                                }}
                            >
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "600" }}>{translate("listingTitle")}</TableCell>
                                    <TableCell sx={{ fontWeight: "600" }} align="center">
                                        {translate("status")}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "600" }} align="center">
                                        {translate("action")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            {/* Centered loader */}
                                            <div>
                                                <Loader />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : Data.length > 0 ? (
                                    Data && Data.map((elem, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" sx={{ width: "40%" }}>
                                                <div className="card" id="listing_card">
                                                    <div className="listing_card_img">
                                                        <Image loading="lazy" src={'https://admin.rocaromana.com/images/publicity/' + elem?.imagen} alt="no_img" id="main_listing_img" width={200} height={240} onError={placeholderImage} />
                                                    </div>
                                                    <div className="listing_card_body">
                                                        <span className="listing_prop_title">{elem?.titulo}</span>
                                                        <span className="listing_prop_loc">
                                                            {elem?.link}
                                                        </span>
                                                        <span className="listing_prop_pirce">
                                                            
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell align="center">
                                                {elem?.estado}
                                            </TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <p>{translate("noDataAvailabe")}</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {Data.length > 0 ? (
                        <div className="col-12">
                            <ReactPagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                        </div>
                    ) : null}
                </div>
            </div>


            <Modal centered open={showAddModal} footer={null} onCancel={close}>
                <div className="form-group">
                    <label>{translate("Crear anuncio.")}</label>

                    <div class="mb-3">
                        <label for="titulo" class="form-label">Título</label>
                        <input type="text" class="form-control" id="titulo" placeholder="Ingresa el título" required onChange={Anounce.titulo()}/>
                    </div>

                    <div class="mb-3">
                        <label for="imagen" class="form-label">Imagen</label>
                        <input type="file" class="form-control" id="imagen" accept="image/*" required onChange={Anounce.imagen()}/>
                    </div>

                    <div class="mb-3">
                        <label for="link" class="form-label">Link</label>
                        <input type="url" class="form-control" id="link" placeholder="Ingresa el link" required onChange={Anounce.link()}/>
                    </div>


                    <button type="button" class="btn btn-primary pull-right" onClick={Anounce.save()}>Enviar</button>
                </div>
            </Modal>


        </VerticleLayout>



    );


};

export default UserPublicidad;
