import {
    ProductImageScroller,
    CircularProgressBar,
    DeleteBtn,
    ShareLink,
} from "@/components/shared";
import DonationBtn from "@/components/shared/donationBtn";
import { IDonationList } from "@/helpers/models/fundraising";
import { SHARE_URL } from "@/helpers/services/urls";
import { useDetails } from "@/helpers/store/useUserDetails";
import { capitalizeFLetter } from "@/helpers/utils/capitalLetter";
import { formatNumberWithK } from "@/helpers/utils/formatNumberWithK";
import { formatNumber } from "@/helpers/utils/numberFormat";
import { textLimit } from "@/helpers/utils/textlimit";
import useCustomTheme from "@/hooks/useTheme";
import { Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";

export default function DonationCard({
    item,
    pasted,
}: {
    item: IDonationList;
    pasted?: boolean;
}) {
    const { mainBackgroundColor, bodyTextColor } = useCustomTheme();

    const router = useRouter();
    const query = useSearchParams();
    const frame = query?.get("frame");

    const { userId } = useDetails((state) => state);

    const clickHander = (index: string) => {
        if (frame) {
            window.location.href = `${SHARE_URL}/fundraiser/${index}`;
        } else {
            router?.push("/product/details/fundraising/" + index);
        }
    };

    return (
        <Flex
            flexDir={"column"}
            pos={"relative"}
            bgColor={mainBackgroundColor}
            borderWidth={"1px"}
            rounded={"10px"}
            w={"full"}
            h={"full"}
        >
            {item?.user?.userId === userId && item?.total === 0 && (
                <DeleteBtn
                    donation={true}
                    id={item?.id}
                    isOrganizer={item?.user?.userId === userId}
                    name={item?.name}
                />
            )}
            <Flex
                onClick={() => clickHander(item?.id)}
                cursor={"pointer"}
                w={"full"}
                h={"fit-content"}
                pos={"relative"}
            >
                <ProductImageScroller
                    images={[item?.bannerImage]}
                    createdDate={moment(item?.createdDate)?.fromNow()}
                    userData={item?.createdBy}
                />
                {/* {!frame && (
                    <ShareLink
                        data={item}
                        type="DONATION"
                        // size="18px"
                        showText={false}
                        id={item?.id}
                    />
                )} */}
                {!frame && (
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
                )}
            </Flex>
            <Flex
                w={"full"}
                flexDir={"column"}
                px={["2", "2", "3"]}
                pt={["2", "2", "3"]}
                gap={"2"}
                pb={[
                    "2",
                    "2",
                    userId !== item?.createdBy?.userId && !pasted && !frame
                        ? "0px"
                        : "3",
                ]}
            >
                <Flex w={"full"}>
                    <Flex w={"full"} alignItems={"start"} flexDir={"column"}>
                        <Text fontSize={"12px"} color={bodyTextColor}>
                            Fundraising Title
                        </Text>
                        <Text fontWeight={"700"} fontSize={"14px"}>
                            {textLimit(capitalizeFLetter(item?.name), 15)}
                        </Text>
                    </Flex>
                    <Flex w={"full"} alignItems={"end"} flexDir={"column"}>
                        <Text fontSize={"12px"} color={bodyTextColor}>
                            Target{" "}
                        </Text>
                        <Text fontWeight={"700"} fontSize={"14px"}>
                            {formatNumberWithK(item?.goal, true)}
                        </Text>
                    </Flex>
                </Flex>
                <Flex w={"full"}>
                    <Flex w={"full"} alignItems={"start"} flexDir={"column"}>
                        <Text fontSize={"12px"} color={bodyTextColor}>
                            Amount Raised
                        </Text>
                        <Text fontWeight={"700"} fontSize={"14px"}>
                            {formatNumber(item?.total)}
                        </Text>
                    </Flex>
                    <Flex w={"full"} alignItems={"end"} flexDir={"column"}>
                        <CircularProgressBar
                            fontSize={"10px"}
                            isEvent={true}
                            size={35}
                            strokeWidth={3}
                            progress={
                                Number(item?.total) === 0 &&
                                Number(item?.goal) === 0
                                    ? 0
                                    : (Number(item?.total) /
                                            Number(item?.goal)) *
                                            100 >
                                        100
                                      ? 100
                                      : Number(
                                            (
                                                (Number(item?.total) /
                                                    Number(item?.goal)) *
                                                100
                                            )?.toFixed(2),
                                        )
                            }
                        />
                    </Flex>
                </Flex>
            </Flex>

            {userId !== item?.createdBy?.userId && !pasted && !frame && (
                <Flex
                    as={"button"}
                    w={"full"}
                    display={["none", "none", "flex"]}
                    borderTopWidth={"1px"}
                    fontFamily={"14px"}
                    mt={2}
                    px={"3"}
                    fontWeight={"600"}
                    py={"4"}
                    justifyContent={"center"}
                >
                    <DonationBtn item={item} user={item?.user} />
                </Flex>
            )}
        </Flex>
    );
}
