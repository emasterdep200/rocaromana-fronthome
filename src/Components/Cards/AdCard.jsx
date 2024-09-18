import { AddFavourite } from "@/store/actions/campaign";
import { settingsData } from "@/store/reducer/settingsSlice";
import { formatPriceAbbreviated, isThemeEnabled, placeholderImage, translate } from "@/utils";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import Image from "next/image";
import { ImageToSvg } from "./ImageToSvg";
import Swal from "sweetalert2";
import LoginModal from "../LoginModal/LoginModal";

function AdCard({ ele, removeCard, onImageLoad }) {


    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;

    const isLoggedIn = useSelector((state) => state.User_signup);

    const handleImageLoad = () => {
        if (onImageLoad) {
            onImageLoad();
        }
    };
    // Initialize isLiked based on ele?.is_favourite
    const [isLiked, setIsLiked] = useState(ele?.is_favourite === 1);

    // Initialize isDisliked as false
    const [isDisliked, setIsDisliked] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLike = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isLoggedIn && isLoggedIn.data && isLoggedIn.data.token) {
            AddFavourite(
                ele?.id,
                "1",
                (response) => {
                    setIsLiked(true);
                    setIsDisliked(false);
                    toast.success(response.message);
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            Swal.fire({
                title: translate("plzLogFirst"),
                icon: "warning",
                allowOutsideClick: false,
                showCancelButton: false,
                allowOutsideClick: true,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowModal(true)
                }
            });
        }
    };

    const handleDislike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        AddFavourite(
            ele?.id,
            "0",
            (response) => {
                setIsLiked(false);
                setIsDisliked(true);
                toast.success(response.message);
                if (removeCard) {
                    setIsLiked(true);

                    removeCard(ele?.id);
                }
            },
            (error) => {
                console.log(error);
            }
        );
    };

    useEffect(() => {
        // Update the state based on ele?.is_favourite when the component mounts
        setIsLiked(ele?.is_favourite === 1);
        setIsDisliked(false);
    }, [ele?.is_favourite]);

    const DummyImgData = useSelector(settingsData);
    const PlaceHolderImg = DummyImgData?.web_placeholder_logo;
    const themeEnabled = isThemeEnabled();

    return (
        <div className="verticle_card">
            <div className="card ad_main_card">
                <div className="ad_card_img_div">
                    <Image loading="lazy" className="card-img" id="ad_card_img" src={`https://admin.rocaromana.com/images/publicity/${ele?.imagen}`} alt="no_img" width={200} height={330} onLoad={handleImageLoad} onError={placeholderImage} />
                </div>
            </div>
        </div >
    );
}

export default AdCard;
