"use client"
import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import PercentIcon from '@mui/icons-material/Percent';
import { useSelector } from "react-redux";
import { GetFeturedListingsApi, GetLimitsApi, getAddedPropertiesApi, getVentasApi } from "@/store/actions/campaign";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Menu, Dropdown, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useRouter } from "next/router";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactPagination from "../../../src/Components/Pagination/ReactPagination.jsx";
import { deletePropertyApi } from "@/store/actions/campaign";
import Loader from "../../../src/Components/Loader/Loader.jsx";
import toast from "react-hot-toast";
import { FaCrown } from "react-icons/fa";
import { MdOutlineSell } from "react-icons/md";
import FeatureModal from "@/Components/FeatureModal/FeatureModal.jsx";
import ChangeStatusModal from "@/Components/ChangeStatusModal/ChangeStatusModal.jsx";
import { placeholderImage, translate } from "@/utils/index.js";
import { languageData } from "@/store/reducer/languageSlice.js";
import Swal from "sweetalert2";
import Image from "next/image";
import dynamic from "next/dynamic.js";
import { FaRegEye } from "react-icons/fa";
import Link from "next/link.js";
import TablePagination from "../Pagination/TablePagination.jsx";
import { logoutSuccess, selectUser, userSignUpData } from "@/store/reducer/authSlice";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { Flex, Progress } from 'antd';


const VerticleLayoutAsesor = dynamic(() => import('../AsesoresLayout/VerticleLayout.jsx'), { ssr: false })
const AsesorDashboard = () => {

    const limit = 8;

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [getFeaturedListing, setGetFeaturedListing] = useState([]);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [propertyIdToDelete, setPropertyIdToDelete] = useState(null);
    const [propertyId, setPropertyId] = useState(null);
    const [propertyType, setPropertyType] = useState(null);
    const [changeStatus, setChangeStatus] = useState(false);
    const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false);
    const [changestatusModal, setChangestatusModal] = useState(false);

    const startIndex = total > 0 ? (offsetdata * limit) + 1 : 0;
    const endIndex = Math.min((offsetdata + 1) * limit, total);
    const SettingsData = useSelector(settingsData);

    const signupData = useSelector(userSignUpData);
    const aid  = signupData?.data?.data?.aid;
    const code = signupData?.data?.data?.asesor?.referencia;

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);


    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
      height: 10,
      borderRadius: 5,
      [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
      },
    }));




    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const userData = isLoggedIn && isLoggedIn?.data?.data?.name;

    useEffect(() => {
        setIsLoading(true);

        getVentasApi({
            asesor: 1,
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                setTotal(response.total);
                // const FeaturedListingData = response.data;
                setIsLoading(false);
                // setGetFeaturedListing(FeaturedListingData);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }

        })

    }, [offsetdata, isLoggedIn, propertyIdToDelete, changeStatus]);

    useEffect(() => { }, [propertyId, propertyIdToDelete, propertyType, changeStatus]);
    useEffect(() => {
        setChangeStatus(false)
    }, [changeStatus]);


    return (
        <VerticleLayoutAsesor>
            <div className="container">
                <div className="row" id="dashboard_top_card">
                    <div className="col-12">
                        <div className="row" id="dashboard_top_card">
                            <div className="col-12 col-md-12 col-lg-4">
                                <div className="card" id="dashboard_card">
                                    <div id="dashboard_user">
                                        <div>
                                            <span className="dashboard_user_title">
                                                {translate("hy")} {""} {userData}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-12 col-lg-4">
                                <div className="card" id="dashboard_total_prop_card">
                                    <div className="totalprop">
                                        <span>{translate("Presupuesto")}</span>
                                          <Flex gap="small" vertical>
                                            <Progress percent={30} size={[300, 20]}/>
                                          </Flex>
                                    </div>
                                    <div className="total_prop_icon" style={{"margin-left": "0.5rem" }}>
                                        <span>
                                            <PercentIcon sx={{ fontSize: "35px" }} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-12 col-lg-4">
                                <div className="card" id="dashboard_total_prop_card">
                                    <div className="totalprop">
                                        <span>{translate("ID Asesor")}</span>
                                        <h4>{code}</h4>
                                    </div>
                                    <div className="total_prop_icon">
                                        <span>
                                            <StarIcon sx={{ fontSize: "35px" }} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </VerticleLayoutAsesor>

    )
}

export default AsesorDashboard
