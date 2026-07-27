"use client";
import { IEventType } from "@/helpers/models/event";
import useCustomTheme from "@/hooks/useTheme";
import { Flex, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductImageScroller, ShareLink } from "../../shared";
import moment from "moment";
import { LocationStrokeEx } from "@/svg";
import { textLimit } from "@/helpers/utils/textlimit";
import InterestedUsers from "../interestedUser";
import EventPrice from "../eventPrice";
import { SHARE_URL } from "@/helpers/services/urls";
import { useEffect, useState } from "react";
import httpService from "@/helpers/services/httpService";
import { useMutation } from "@tanstack/react-query";
import { capitalizeFLetter } from "@/helpers/utils/capitalLetter";
import { SaveEventBtn } from "@/components/eventdetailscomponents";

export default function EventCard({ event }: { event: IEventType }) {
    const router = useRouter();

    const { primaryColor, mainBackgroundColor } = useCustomTheme();
    const query = useSearchParams();
    const frame = query?.get("frame");

    const [hasPinnedItem, setHasPinnedItem] = useState(false);
    const [hasPinnedFundraiser, setHasPinnedFundraiser] = useState(false);

    const { mutate: hasPinnedItems } = useMutation({
        mutationFn: () =>
            httpService.get(`/pin-item/hasPinnedItems/${event?.id}`),
        onError: (error: any) => {
            console.log(error);
        },
        onSuccess: (data: any) => {
            setHasPinnedItem(data?.data);
        },
    });

    const { mutate: hasPinnedFundraisers } = useMutation({
        mutationFn: () =>
            httpService.get(`/pinned-fundraisers/has-pinned/${event?.id}`),
        onError: (error: any) => {
            console.log(error);
        },
        onSuccess: (data: any) => {
            setHasPinnedFundraiser(data?.data);
        },
    });

    // /pinned-fundraisers/has-pinned/{eventID}

    const clickHandler = () => {
        if (frame) {
            window.location.href = `${SHARE_URL}/event/${event?.id}`;
        } else {
            router.push("/product/details/events/" + event?.id);
        }
    };

    useEffect(() => {
        hasPinnedItems();
        hasPinnedFundraisers();
    }, [event?.id]);

    console.log(hasPinnedFundraiser);

    return (
        <Flex
            as={"button"}
            flexDir={"column"}
            h={"fit"}
            bgColor={mainBackgroundColor}
            borderWidth={"1px"}
            rounded={"10px"}
            w={"full"}
        >
            <Flex w={"full"} pos={"relative"} onClick={() => clickHandler()}>
                <ProductImageScroller
                    images={
                        event.picUrls.length > 0
                            ? event.picUrls
                            : [event?.currentPicUrl]
                    }
                    createdDate={moment(event?.createdDate)?.fromNow()}
                    userData={event?.createdBy}
                />
                {!frame && (
                    // <ShareLink
                    //     data={event}
                    //     type="EVENT"
                    //     // size="18px"
                    //     affiliateID={event?.affiliateID}
                    //     showText={false}
                    //     id={event?.id}
                    // />

                    <Flex
                        // zIndex={"0"}
                        pos={"absolute"}
                        bottom={"4"}
                        right={"4"}
                        gap={"4"}
                    >
                        <ShareLink
                            data={event}
                            type="EVENT"
                            // size="18px"
                            affiliateID={event?.affiliateID}
                            showText={false}
                            id={event?.id}
                        />
                        <SaveEventBtn event={event} />
                    </Flex>
                )}

                <Flex
                    onClick={() => clickHandler()}
                    w={"fit-content"}
                    pos={"absolute"}
                    bottom={"4"}
                    left={"2"}
                >
                    <Flex
                        width={"40px"}
                        flexDir={"column"}
                        py={"2"}
                        alignItems={"center"}
                        roundedBottom={"20px"}
                        roundedTopLeft={"20px"}
                        bgColor={"#C4C4C499"}
                        borderWidth={"1px"}
                    >
                        <Text
                            fontSize={"10px"}
                            fontWeight={"700"}
                            lineHeight={"10px"}
                            color={"white"}
                        >
                            {moment(event?.startDate).format("MMM")}
                        </Text>
                        <Text
                            lineHeight={"16px"}
                            fontWeight={"700"}
                            color={"white"}
                            fontSize={"16px"}
                        >
                            {moment(event?.startDate).format("D")}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex
                flexDir={"column"}
                w={"full"}
                px={["1", "1", "3"]}
                pt={["2", "2", "3"]}
                gap={"1"}
                pb={
                    hasPinnedItem ||
                    hasPinnedFundraiser ||
                    event?.interestedUsers?.length > 0 ||
                    event?.affiliates?.length > 0
                        ? "4"
                        : ["1", "1", "1"]
                }
            >
                <Flex
                    gap={"2"}
                    w={"full"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Flex
                        w={"full"}
                        flexDirection={"column"}
                        alignItems={"start"}
                    >
                        <Flex
                            w={"full"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            <Text
                                fontSize={["12px", "12px", "14px"]}
                                fontWeight={"700"}
                                display={["none", "none", "flex"]}
                                mr={"auto"}
                            >
                                {capitalizeFLetter(
                                    textLimit(event?.eventName, 20),
                                )}
                            </Text>
                            <Text
                                fontSize={["12px", "12px", "14px"]}
                                fontWeight={"700"}
                                display={["flex", "flex", "none"]}
                                mr={"auto"}
                            >
                                {capitalizeFLetter(
                                    textLimit(event?.eventName, 10),
                                )}
                            </Text>
                            <Text
                                color={primaryColor}
                                display={["block"]}
                                ml={"auto"}
                                fontWeight={"600"}
                                fontSize={["10px", "10px", "14px"]}
                            >
                                <EventPrice
                                    minPrice={event?.minPrice}
                                    maxPrice={event?.maxPrice}
                                    currency={event?.currency}
                                />
                            </Text>
                        </Flex>
                        <Flex w={"full"} justifyContent={"space-between"}>
                            <Flex>
                                <Flex
                                    display={["none", "none", "flex"]}
                                    alignItems={"center"}
                                    gap={"1"}
                                >
                                    <Flex w={"fit-content"} mt={"2px"}>
                                        <LocationStrokeEx
                                            color={primaryColor}
                                            size="17px"
                                        />
                                    </Flex>
                                    <Text
                                        color={primaryColor}
                                        textAlign={"left"}
                                        fontSize={"12px"}
                                        fontWeight={"500"}
                                    >
                                        {event?.location?.toBeAnnounced
                                            ? "To Be Announced"
                                            : textLimit(
                                                  event?.location
                                                      ?.locationDetails + "",
                                                  17,
                                              )}
                                    </Text>
                                </Flex>
                                <Flex
                                    display={["flex", "flex", "none"]}
                                    alignItems={"center"}
                                    gap={"1"}
                                >
                                    <Flex w={"fit-content"} mt={"2px"}>
                                        <LocationStrokeEx
                                            color={primaryColor}
                                            size="17px"
                                        />
                                    </Flex>
                                    <Text
                                        color={primaryColor}
                                        textAlign={"left"}
                                        fontSize={"10px"}
                                        fontWeight={"500"}
                                    >
                                        {event?.location?.toBeAnnounced
                                            ? "To Be Announced"
                                            : textLimit(
                                                  event?.location
                                                      ?.locationDetails + "",
                                                  15,
                                              )}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex h={"7"}>
                                {event?.interestedUsers?.length > 0 && (
                                    <Flex alignItems={"center"}>
                                        <InterestedUsers
                                            size={"2xs"}
                                            event={event}
                                        />
                                    </Flex>
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>

            {event?.affiliates?.length > 0 && (
                <>
                    {(hasPinnedItem ||
                        hasPinnedFundraiser ||
                        event?.affiliates[0]?.affiliateType) && (
                        <Flex
                            borderTopWidth={"1px"}
                            w={"full"}
                            mt={["auto"]}
                            gap={"2"}
                            h={["50px", "50px", "50px"]}
                            px={["2", "2", "3"]}
                            alignItems={"center"}
                        >
                            {hasPinnedFundraiser && (
                                <Flex
                                    rounded={"5px"}
                                    fontWeight={"semibold"}
                                    fontSize={"10px"}
                                    height={"30px"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    w={"full"}
                                    maxW={"40%"}
                                    color={"#233DF3"}
                                    bgColor={"#F2F4FF"}
                                >
                                    <Text>Fundraiser</Text>
                                </Flex>
                            )}
                            {event?.affiliates[0]?.affiliateType && (
                                <Flex
                                    rounded={"5px"}
                                    fontWeight={"semibold"}
                                    fontSize={"10px"}
                                    height={"30px"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    w={"full"}
                                    maxW={"40%"}
                                    color={"#12BC42"}
                                    bgColor={"#F3FFF6"}
                                >
                                    <Text>Needs a PR</Text>
                                </Flex>
                            )}
                            {hasPinnedItem && (
                                <Flex
                                    rounded={"5px"}
                                    fontWeight={"semibold"}
                                    fontSize={"10px"}
                                    height={"30px"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    w={"full"}
                                    maxW={"40%"}
                                    color={"#FCD516"}
                                    bgColor={"#FFFCF3"}
                                >
                                    <Text>Item for sale</Text>
                                </Flex>
                            )}
                        </Flex>
                    )}
                </>
            )}
        </Flex>
    );
}
