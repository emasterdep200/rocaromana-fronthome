"use client"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetFavPropertyApi, getComisionApi } from "@/store/actions/campaign";
import VerticalCardSkeleton from "@/Components/Skeleton/VerticalCardSkeleton";
import VerticalCard from "@/Components/Cards/VerticleCard";
import Link from "next/link";
import { languageData } from "@/store/reducer/languageSlice";
import Pagination from "@/Components/Pagination/ReactPagination";
import { translate } from "@/utils";
import NoData from "@/Components/NoDataFound/NoData";
import dynamic from "next/dynamic.js";
import TablePagination from "../Pagination/TablePagination.jsx";
import ReactPagination from "@/Components/Pagination/ReactPagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loader from "../../../src/Components/Loader/Loader.jsx";

import { logoutSuccess, selectUser, userSignUpData } from "@/store/reducer/authSlice";



const VerticleLayoutAsesor = dynamic(() => import('../../../src/Components/AsesoresLayout/VerticleLayout.jsx'), { ssr: false })


const Comisiones = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [getFavProp, setGetFavProp] = useState([]);
    const [offsetdata, setOffsetdata] = useState(0);
    const limit = 8;
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [ventas, setVentas] = useState([]);



    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const lang = useSelector(languageData);


    const signupData = useSelector(userSignUpData);
    const aid = signupData?.data?.data?.aid;


    useEffect(() => { }, [lang]);
    useEffect(() => {

        getComisionApi({
            asesor: aid,
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                setTotal(response.total);
                setIsLoading(false);
                setVentas(response.data);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }

        })


    }, [offsetdata, aid]);

    const removeCard = (cardId) => {
        const updatedFavProp = getFavProp.filter((ele) => ele.id !== cardId);
        setGetFavProp(updatedFavProp);
    };

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        updateIndices(newOffset, total);
        window.scrollTo(0, 0);
    };
    const updateIndices = (newOffset, total) => {
        const newStartIndex = total > 0 ? newOffset * limit + 1 : 0;
        const newEndIndex = Math.min((newOffset + 1) * limit, total);
        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
    };

    return (
        <VerticleLayoutAsesor>
            <div className="container">
                <div className="dashboard_titles">
                    <h3>{translate("Comissions")}</h3>
                </div>
                <div className="fav_card">
                    <div className="row">
                        <div className="col-12">
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
                                            <TableCell sx={{ fontWeight: "600" }}>#</TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">Comisón</TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">Estado</TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">Fecha</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    <div>
                                                        <Loader />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : ventas && ventas.length > 0 ? (
                                            ventas && ventas.map((elem, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row" sx={{ width: "25%", "text-align":"center"}}>{elem.id}</TableCell>
                                                    <TableCell component="th" scope="row" sx={{ width: "25%", "text-align":"center" }}>{elem.comision}</TableCell>
                                                    <TableCell component="th" scope="row" sx={{ width: "25%", "text-align":"center"}}>{elem.estado == "P" ? 'Pendiente' : 'Pagada'}</TableCell>
                                                    <TableCell component="th" scope="row" sx={{ width: "25%", "text-align":"center"}}>{elem.created_at}</TableCell>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VerticleLayoutAsesor>
    );
};

export default Comisiones;
