import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

import { ShareType } from "@/helpers/models/share";
import useCustomTheme from "@/hooks/useTheme";
import { SHARE_URL } from "@/helpers/services/urls";
import { capitalizeFLetter } from "@/helpers/utils/capitalLetter";
import { textLimit } from "@/helpers/utils/textlimit";

import { CustomButton } from "../shared";
import CopyRightText from "../shared/copyRightText";

import { IoIosClose } from "react-icons/io";

interface Props {
  id: string | number;
  close: any;
  data?: any;
  name?: string;
  type?: ShareType;
  affiliateID: any;
}

function Qr_code(props: Props) {
  const { id, close, data, type, name, affiliateID } = props;

  const { bodyTextColor, primaryColor } = useCustomTheme();

  const componentRef = useRef<HTMLDivElement>(null);

  const downloadComponentAsPNG = async () => {
    if (!componentRef.current) return;

    try {
      const dataUrl = await toPng(componentRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `${
        data?.eventName || data?.name || "QRCode"
      }.png`;

      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const url_link =
    type === "EVENT"
      ? `${SHARE_URL}/event/${id}/opengraph${
          affiliateID ? `?affiliateID=${affiliateID}` : ""
        }`
      : type === "RENTAL"
      ? `${SHARE_URL}/rental?id=${id}`
      : type === "SERVICE"
      ? `${SHARE_URL}/service?id=${id}`
      : type === "KIOSK"
      ? `${SHARE_URL}/product?id=${id}`
      : type === "DONATION"
      ? `${SHARE_URL}/fundraiser/${id}/opengraph`
      : `${SHARE_URL}/event/${id}/opengraph`;

  return (
    <Flex
      flexDir="column"
      roundedTop="lg"
      alignItems="center"
      pb="8"
        bg="white"
      position="relative"
    >
      <Box
        onClick={() => close(false)}
        cursor="pointer"
        width="25px"
        zIndex={30}
        position="absolute"
        top="2"
        right="4"
      >
        <IoIosClose size="30px" color="white" />
      </Box>

      <Flex
        ref={componentRef}
        flexDir="column"
        alignItems="center"
        width="100%" 
        bg="white"
        borderRadius="20px"
        overflow="hidden"
      >
        <Box
          h="300px"
          w="100%"
          bg="#5D70F9"
          borderBottomRadius="full"
        />

        <Flex
          position="absolute"
          top="0"
          left="0"
          right="0"
          flexDir="column"
          alignItems="center"
          pt="6"
        >
          <HStack>
            <Text
              color="white"
              fontWeight="bold"
              fontSize="24px"
            >
              Chasescroll
            </Text>
          </HStack>

          <Flex
            mt="4"
            flexDir="column"
            alignItems="center"
            color="white"
          >
            <Text fontSize="14px">
              {type
                ? `${capitalizeFLetter(type)} Name`
                : "Name"}
            </Text>

            <Text
              fontWeight="bold"
              fontSize="18px"
            >
              {textLimit(
                name ||
                  data?.eventName ||
                  data?.name ||
                  "",
                20
              )}
            </Text>
          </Flex>

          <Box
            mt="8"
            bg="white"
            p="4"
            rounded="lg"
            shadow="lg"
            w="220px"
          >
            <QRCode
              value={url_link}
              size={200}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Box>

          <Text mt="6" color={bodyTextColor}>
            {type
              ? "Scan to Confirm Your Order"
              : `Scan here and get your ${
                  type === "EVENT"
                    ? "Event"
                    : type === "RENTAL"
                    ? "Rental"
                    : type === "SERVICE"
                    ? "Service"
                    : type === "KIOSK"
                    ? "Kiosk"
                    : "Fundraising"
                } Link`}
          </Text>

          <Text fontSize="xs" mt="3">
            <CopyRightText />
          </Text>
        </Flex>

        <Box h="220px" />
      </Flex>

      <CustomButton
        mt="6"
        maxWidth="300px"
        backgroundColor={primaryColor}
        text="Download QR Code"
        onClick={downloadComponentAsPNG}
      />
    </Flex>
  );
}

export default Qr_code;