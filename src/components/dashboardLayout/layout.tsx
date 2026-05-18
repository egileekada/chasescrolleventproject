"use client"
import { Button, Flex, Grid, Image, Text } from "@chakra-ui/react";
import useCustomTheme from "@/hooks/useTheme";
import SideBar from "./sidebar";
import Navbar from "./navbar";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import BottomBar from "./bottomBar";
import { useImage } from "@/helpers/store/useImagePicker";
import useSearchStore from "@/helpers/store/useSearchData";
import { useColorMode } from "../ui/color-mode";
import useNotificationHook from "@/hooks/useNotificationHook";
import useGetUser from "@/hooks/useGetUser";
import { ModalLayout } from "../shared";
import { IUser } from "@/helpers/models/user";
import { LANDINGPAGE_URL } from "@/helpers/services/urls";
import Cookies from "js-cookie"
import { Login } from "@/svg";

interface IProps {
    children: React.ReactNode
}

export default function DashboardLayout(
    {
        children
    }: IProps
) {

    const { mainBackgroundColor, headerTextColor, primaryColor } = useCustomTheme()
    const { setSearchValue } = useSearchStore((state) => state)
    const pathname = usePathname()
    const query = useSearchParams();
    const frame = query?.get('frame');
    const theme: any = query?.get('theme');

    const { setImage } = useImage((state: any) => state)

    const { setColorMode } = useColorMode();

    useEffect(() => {
        if (theme) {
            setColorMode(theme)
        }
    }, [theme]);

    useEffect(() => {
        setImage([])
        setSearchValue("")
    }, [pathname])
    const { count } = useNotificationHook()
    const { colorMode } = useColorMode();
    const { isLoading, user, show, setShow } = useGetUser()

    const login = () => {
        Cookies.remove("chase_token")
        window.location.href = `${LANDINGPAGE_URL}/logout`;
    }

    return (
        <Flex w={"100vw"} h={"100vh"} color={headerTextColor} bgColor={mainBackgroundColor} >
            {!frame && (
                <SideBar isLoading={isLoading} user={user as IUser} count={count} />
            )}
            <Flex w={"full"} height={"100vh"} pos={"relative"} flexDirection={"column"} >
                {!frame && (
                    <Flex w={"full"} display={["flex", "flex", (!pathname?.includes("create") && !pathname?.includes("details")) ? "flex" : "none"]} pos={"relative"} >
                        <Navbar />
                    </Flex>
                )}
                <Flex w={"full"} h={"full"} pos={"relative"} >
                    <Flex w={"full"} pos={"absolute"} overflowY={"auto"} bottom={frame ? "0px" : ["70px", "70px", "70px", "0px", "0px", "0px"]} top={frame ? "0px" : ["76px", "76px", "76px", "0px", "0px"]} insetX={"0px"} >
                        {children} 
                    </Flex>
                    <Grid templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)"]} bgColor={colorMode !== "dark" ? "transparent" : "#000"} opacity={colorMode !== "dark" ? "100%" : "15%"} pos={"absolute"} inset={"0px"} zIndex={"-5"} w={"full"} h={"full"} overflow={"hidden"} >
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                        <Image src='/images/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                    </Grid>
                </Flex>
                {!frame && (
                    <BottomBar count={count} />
                )}
            </Flex> 
            <ModalLayout size={"xs"} trigger={true} open={frame ? false : show} close={() => setShow(true)} >
                <Flex
                    width={"100%"}
                    height={"100%"}
                    justifyContent={"center"}
                    gap={1}
                    rounded={"lg"}
                    flexDirection={"column"}
                    bgColor={mainBackgroundColor}
                    p={"6"}
                    position={"relative"}
                    zIndex={"50"}
                    alignItems={"center"}
                >
                    <Flex
                        width="60px"
                        height={"60px"}
                        borderRadius={"full"}
                        justifyContent={"center"}
                        bg="#df26263b"
                        alignItems={"center"}
                    >
                        <Login />
                    </Flex>
                    <Text fontSize={"24px"} mt={"4"} fontWeight={"600"} >
                        Session Expired
                    </Text>
                    <Text fontSize={"sm"} textAlign={"center"} >Your session has expired. please log in again to continue</Text>
                    <Flex justifyContent={"center"} mt={4} roundedBottom={"lg"} gap={"3"} width={"100%"}>
                        <Button
                            borderColor={primaryColor}
                            borderWidth={"1px"}
                            rounded={"full"}
                            _hover={{ backgroundColor: primaryColor }}
                            bg={primaryColor}
                            width="60%"
                            fontWeight={"600"}
                            cursor={"pointer"}
                            height={"45px"}
                            color="white"
                            onClick={() => login()}
                        >
                            Login
                        </Button>
                    </Flex>
                </Flex>
            </ModalLayout>
        </Flex>
    )
}
