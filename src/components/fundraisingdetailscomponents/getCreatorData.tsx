import { Chat } from '@/helpers/models/chat';
import { IUser } from '@/helpers/models/user';
import httpService from '@/helpers/services/httpService';
import { DASHBOARDPAGE_URL, WEBSITE_URL } from '@/helpers/services/urls';
import { useDetails } from '@/helpers/store/useUserDetails';
import useCustomTheme from '@/hooks/useTheme';
import { Flex, Text } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; 
import UsersDonation from './usersDonating';
import { CustomButton, UserImage } from '../shared';
import { capitalizeFLetter } from '@/helpers/utils/capitalLetter';
import { textLimit } from '@/helpers/utils/textlimit';
import { useColorMode } from '../ui/color-mode';

export default function GetCreatorData({ userData, donation, data: donationData}: { userData: IUser, data?: any, donation?: boolean }) {

    const { userId: user_index } = useDetails((state) => state);
    const { secondaryBackgroundColor } = useCustomTheme()
    const router = useRouter();
    
    let token = localStorage.getItem("token")
    const { colorMode } = useColorMode();

    const clickHandler = () => {
        if (!user_index) {
            // router.push("/share/auth/login?type=EVENT&typeID=" + id)
        } else {
            // router.push("/dashboard/profile/" + userData?.userId)
            window.location.href = `${DASHBOARDPAGE_URL}/dashboard/profile/${userData?.userId}?token=${token}&theme=${colorMode}`; 
        }
    } 
 

    const { isPending: chatCreationLoading, mutate } = useMutation({
        mutationFn: () =>
            httpService.post(`/chat/chat`, {
                type: "ONE_TO_ONE",
                typeID: userData?.userId,
                users: [userData?.userId],
            }),
        onSuccess: (data) => {
            const chat = data?.data as Chat;
            const obj = {
                message: `${WEBSITE_URL}/share?type=ONE_TO_ONE&typeID=${userData?.userId}`,
                chatID: chat?.id,
            };
            router.push(`/dashboard/chats?activeID=${obj?.chatID}`);
            // sendMessage.mutate(obj)
        },
    });



    return (
        <Flex bgColor={["transparent", "transparent", secondaryBackgroundColor]} rounded={"64px"} h={["fit-content", "fit-content", "80px"]} px={["0px", "0px", "4"]} w={["120px", "fit-content", "full"]} gap={"2"} flexDir={["column", "column", "row"]} justifyContent={["start", "start", "space-between"]} alignItems={["start", "start", "center"]} >
            <Flex role='button' onClick={clickHandler} gap={"2"} alignItems={"center"} >
                <Flex display={["none", "flex", "flex"]} >
                    <UserImage user={userData} />
                </Flex>
                <Flex display={["flex", "none", "none"]} >
                    <UserImage user={userData} />
                </Flex>
                <Flex flexDir={"column"} >
                    <Text textAlign={"left"} display={["none", "block"]} fontWeight={"medium"} >{capitalizeFLetter(userData?.firstName) + " " + capitalizeFLetter(userData?.lastName)}</Text>
                    <Text textAlign={"left"} display={["block", "none"]} fontWeight={"medium"} fontSize={"12px"} >{textLimit(capitalizeFLetter(userData?.firstName) + " " + capitalizeFLetter(userData?.lastName), 10)}</Text>
                    {/* <Text textAlign={"left"} mt={"-2px"} fontSize={["13px", "13px", "sm"]} >{data?.data?.numberOfElements} followers</Text> */}
                </Flex>
            </Flex>
            <Flex gap={"4"} alignItems={"center"} flexDir={["column", "column", "row"]} >
                {(userData?.userId !== user_index && token)&& (
                    <CustomButton text={"Message"} onClick={() => mutate()} isLoading={chatCreationLoading} height={"30px"} fontSize={"12px"} width={"100px"} borderRadius={"999px"} />
                )} 
                {donation && (
                    <UsersDonation donationDetail={true} size={"42px"} event={donationData} fontSize={14} border='1px' />
                )}
            </Flex>
        </Flex>
    )
}
