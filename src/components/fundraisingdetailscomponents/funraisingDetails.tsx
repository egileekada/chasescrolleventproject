import { IDonationList } from "@/helpers/models/fundraising";
import useCustomTheme from "@/hooks/useTheme";
import { Button, Flex, Text } from "@chakra-ui/react";
import { DonationGraph, ProductImageScroller, ShareLink } from "../shared";
import { BreadCrumbs, DescriptionPage } from "../eventdetailscomponents";
import { textLimit } from "@/helpers/utils/textlimit";
import { capitalizeFLetter } from "@/helpers/utils/capitalLetter";
import GetCreatorData from "./getCreatorData";
import { useDetails } from "@/helpers/store/useUserDetails";
import {
    CalendarIcon,
    DashboardEditIcon,
    DashboardOrganizerIcon,
    WalletIcon,
} from "@/svg";
import { isDateInPast } from "@/helpers/utils/isPast";
import DonationPayment from "./donationPayment";
import { dateFormat, timeFormat } from "@/helpers/utils/dateFormat";
import { useRouter, useSearchParams } from "next/navigation";
import { DASHBOARDPAGE_URL } from "@/helpers/services/urls";
import Cookies from "js-cookie";
import DonationCollaborator from "../createFundraisingComponents/donationCollaborator";
import { useColorMode } from "../ui/color-mode";

export default function FundraisingDetails({ item }: { item: IDonationList }) {
    const { mainBackgroundColor, borderColor, primaryColor, headerTextColor } =
        useCustomTheme();

    const { userId } = useDetails();
    const router = useRouter();

    const token = Cookies.get("chase_token");
    const { colorMode } = useColorMode();

    const routeHandler = (type: "dashboard" | "wallet") => {
        if (type === "dashboard") {
            window.location.href = `${DASHBOARDPAGE_URL}/dashboard/settings/event-dashboard/${item?.id}/donate?token=${token}&theme=${colorMode}`;
        } else {
            window.location.href = `${DASHBOARDPAGE_URL}/dashboard/settings/payment/details?token=${token}&theme=${colorMode}`;
        }
    };

    return (
        <Flex
            w={"full"}
            bgColor={mainBackgroundColor}
            flexDir={"column"}
            gap={"4"}
            px={["4", "4", "6"]}
            pb={["400px", "400px", "6"]}
            py={"6"}
        >
            <BreadCrumbs {...item} />
            <Flex w={"full"} gap={"4"} flexDir={["column", "column", "row"]}>
                <Flex
                    flexDir={"column"}
                    w={"full"}
                    gap={"4"}
                    position={"relative"}
                    height={["340px", "340px", "520px"]}
                >
                    <ProductImageScroller
                        rounded={"8px"}
                        height={["340px", "340px", "520px"]}
                        images={[item.bannerImage]}
                    />

                    <Flex
                        zIndex={"20"}
                        pos={"absolute"}
                        bottom={"4"}
                        right={"4"}
                        gap={"4"}
                    >
                        <ShareLink
                            data={item}
                            type="DONATION"
                            // size="18px"
                            showText={false}
                            id={item?.id}
                        />
                    </Flex>
                </Flex>

                <Flex w={"full"} flexDir={"column"} gap={"3"}>
                    <Flex
                        w={"full"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Text
                            fontWeight={"700"}
                            fontSize={["16px", "16px", "24px"]}
                        >
                            {textLimit(capitalizeFLetter(item?.name), 70)}
                        </Text>
                    </Flex>
                    <Flex display={["none", "none", "flex"]}>
                        <DonationGraph rounded="16px" item={item} />
                    </Flex>
                    <Flex display={["flex", "flex", "none"]}>
                        <DonationGraph
                            rounded="16px"
                            isDonation={true}
                            item={item}
                        />
                    </Flex>
                    <Flex
                        w={"full"}
                        flexDir={["column-reverse", "column-reverse", "column"]}
                        gap={"2"}
                    >
                        <DescriptionPage
                            limit={200}
                            label="Fundraiser Details"
                            description={item?.description + ""}
                        />
                        <Flex
                            w={"full"}
                            gap={"2"}
                            flexDirection={
                                userId === item?.createdBy?.userId ||
                                item?.isCollaborator
                                    ? ["column", "column", "row"]
                                    : "row"
                            }
                        >
                            <Flex w={["fit-content", "fit-content", "full"]}>
                                <GetCreatorData
                                    userData={item?.createdBy}
                                    data={item}
                                    donation={true}
                                />
                            </Flex>

                            <Flex display={["flex", "flex", "none"]} w={"full"}>
                                {userId === item?.createdBy?.userId ||
                                item?.isCollaborator ? (
                                    <Flex
                                        bgColor={mainBackgroundColor}
                                        borderWidth={"1px"}
                                        borderColor={borderColor}
                                        rounded={"full"}
                                        w={"full"}
                                        flexDir={"column"}
                                        overflowX={"hidden"}
                                        gap={"3"}
                                        px={["3", "3", "5", "5"]}
                                        h={"fit-content"}
                                        justifyContent={"center"}
                                    >
                                        <Flex
                                            py={"3"}
                                            width={["full"]}
                                            justifyContent={"space-between"}
                                            alignItems={"center"}
                                            gap={"3"}
                                        >
                                            <Button
                                                onClick={() =>
                                                    routeHandler("dashboard")
                                                }
                                                color={headerTextColor}
                                                bgColor={mainBackgroundColor}
                                                w={"80px"}
                                                py={"2"}
                                                rounded={"2xl"}
                                                _disabled={{
                                                    opacity: "0.4",
                                                    cursor: "not-allowed",
                                                }}
                                                cursor={"pointer"}
                                                gap={"4px"}
                                                flexDir={"column"}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                            >
                                                <DashboardOrganizerIcon />
                                                <Text
                                                    fontSize={"12px"}
                                                    fontWeight={"500"}
                                                >
                                                    Dashboard
                                                </Text>
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    router.push(
                                                        `/product/create/fundraising/edit?id=${item?.id}`,
                                                    )
                                                }
                                                disabled={
                                                    item?.isCollaborator ||
                                                    item?.total > 0 ||
                                                    !isDateInPast(item?.endDate)
                                                }
                                                color={headerTextColor}
                                                bgColor={mainBackgroundColor}
                                                w={"80px"}
                                                py={"2"}
                                                rounded={"2xl"}
                                                _disabled={{
                                                    opacity: "0.4",
                                                    cursor: "not-allowed",
                                                }}
                                                role="button"
                                                cursor={"pointer"}
                                                gap={"4px"}
                                                flexDir={"column"}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                            >
                                                <DashboardEditIcon />
                                                <Text
                                                    fontSize={"12px"}
                                                    fontWeight={"500"}
                                                >
                                                    Edit
                                                </Text>
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    routeHandler("wallet")
                                                }
                                                disabled={item?.isCollaborator}
                                                color={headerTextColor}
                                                bgColor={mainBackgroundColor}
                                                w={"80px"}
                                                py={"2"}
                                                rounded={"2xl"}
                                                cursor={"pointer"}
                                                _disabled={{
                                                    opacity: "0.4",
                                                    cursor: "not-allowed",
                                                }}
                                                gap={"4px"}
                                                flexDir={"column"}
                                                alignItems={"center"}
                                            >
                                                <WalletIcon color="#5D70F9" />
                                                <Text
                                                    fontSize={"12px"}
                                                    fontWeight={"500"}
                                                >
                                                    Cash Out
                                                </Text>
                                            </Button>
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <DonationPayment data={item} />
                                )}
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex gap={"2"} alignItems={"center"}>
                        <Text fontWeight={"600"} w={"80px"}>
                            End Date
                        </Text>
                        <CalendarIcon color={primaryColor} />
                        <Text fontSize={["12px", "12px", "14px"]}>
                            {dateFormat(item?.endDate)}{" "}
                            {timeFormat(item?.endDate)}
                        </Text>
                    </Flex>

                    {item?.createdBy?.userId === userId && (
                        <DonationCollaborator
                            update={true}
                            singleData={item}
                            index={0}
                        />
                    )}
                    <Flex w={"full"} justifyContent={"end"}>
                        <Flex maxW={"600px"} display={["none", "none", "flex"]}>
                            {userId === item?.createdBy?.userId ||
                            item?.isCollaborator ? (
                                <Flex
                                    insetX={"3"}
                                    mt={["0px", "0px", "0px", "0px"]}
                                    bottom={["14", "14", "0px", "0px", "0px"]}
                                    pos={[
                                        "fixed",
                                        "fixed",
                                        "relative",
                                        "relative",
                                    ]}
                                    w={["auto", "auto", "full", "fit-content"]}
                                    zIndex={"50"}
                                    flexDir={"column"}
                                    gap={"4"}
                                    pb={"6"}
                                    px={["0px", "0px", "6", "6"]}
                                >
                                    <Flex
                                        bgColor={mainBackgroundColor}
                                        w={["full", "full", "full", "450px"]}
                                        minW={[
                                            "200px",
                                            "200px",
                                            "200px",
                                            "200px",
                                        ]}
                                        maxW={["full", "full", "450px", "full"]}
                                        borderWidth={"1px"}
                                        borderColor={borderColor}
                                        rounded={"full"}
                                        flexDir={"column"}
                                        overflowX={"hidden"}
                                        gap={"3"}
                                        px={["3", "3", "5", "5"]}
                                        h={"90px"}
                                        justifyContent={"center"}
                                    >
                                        <Flex
                                            width={["full"]}
                                            justifyContent={"space-between"}
                                            alignItems={"center"}
                                            gap={"3"}
                                        >
                                            <Button
                                                onClick={() =>
                                                    routeHandler("dashboard")
                                                }
                                                color={headerTextColor}
                                                borderWidth={"1px"}
                                                borderColor={borderColor}
                                                height={"full"}
                                                bgColor={mainBackgroundColor}
                                                w={"80px"}
                                                py={"2"}
                                                rounded={"2xl"}
                                                _disabled={{
                                                    opacity: "0.4",
                                                    cursor: "not-allowed",
                                                }}
                                                cursor={"pointer"}
                                                gap={"4px"}
                                                flexDir={"column"}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                            >
                                                <DashboardOrganizerIcon />
                                                <Text
                                                    fontSize={"12px"}
                                                    fontWeight={"500"}
                                                >
                                                    Dashboard
                                                </Text>
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    router.push(
                                                        `/product/create/fundraising/edit?id=${item?.id}`,
                                                    )
                                                }
                                                color={headerTextColor}
                                                borderWidth={"1px"}
                                                borderColor={borderColor}
                                                height={"full"}
                                                disabled={
                                                    item?.isCollaborator ||
                                                    item?.total > 0 ||
                                                    !isDateInPast(item?.endDate)
                                                }
                                                bgColor={mainBackgroundColor}
                                                w={"80px"}
                                                py={"2"}
                                                rounded={"2xl"}
                                                _disabled={{
                                                    opacity: "0.4",
                                                    cursor: "not-allowed",
                                                }}
                                                role="button"
                                                cursor={"pointer"}
                                                gap={"4px"}
                                                flexDir={"column"}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                            >
                                                <DashboardEditIcon />
                                                <Text
                                                    fontSize={"12px"}
                                                    fontWeight={"500"}
                                                >
                                                    Edit
                                                </Text>
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    routeHandler("wallet")
                                                }
                                                color={headerTextColor}
                                                borderWidth={"1px"}
                                                borderColor={borderColor}
                                                height={"full"}
                                                disabled={item?.isCollaborator}
                                                bgColor={mainBackgroundColor}
                                                w={"80px"}
                                                py={"2"}
                                                rounded={"2xl"}
                                                cursor={"pointer"}
                                                _disabled={{
                                                    opacity: "0.4",
                                                    cursor: "not-allowed",
                                                }}
                                                gap={"4px"}
                                                flexDir={"column"}
                                                alignItems={"center"}
                                            >
                                                <WalletIcon color="#5D70F9" />
                                                <Text
                                                    fontSize={"12px"}
                                                    fontWeight={"500"}
                                                >
                                                    Cash Out
                                                </Text>
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            ) : (
                                <Flex
                                    insetX={"6"}
                                    bottom={["14", "14", "0px", "0px", "0px"]}
                                    pos={[
                                        "fixed",
                                        "fixed",
                                        "relative",
                                        "relative",
                                    ]}
                                    w={["auto", "auto", "full", "fit-content"]}
                                    display={["none", "none", "flex"]}
                                    zIndex={"50"}
                                    flexDir={"column"}
                                    gap={"4"}
                                    pb={"6"}
                                    px={["0px", "0px", "6", "6"]}
                                >
                                    <DonationPayment data={item} />
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
