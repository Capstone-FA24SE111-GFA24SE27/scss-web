import { Heading } from '@/shared/components';

/**
 * The contacts header.
 */
function CounselingHeader() {
    // const searchText = useAppSelector(selectSearchText);
    // const { data, isLoading } = useGetContactsListQuery();

    // const filteredData = useAppSelector(selectFilteredContactList(data));

    // useEffect(() => {
    //     return () => {
    //         dispatch(resetSearchText());
    //     };
    // }, []);

    // if (isLoading) {
    //     return null;
    // }
    return (
        <>
            <div className="px-24 py-16 sm:px-32 w-full bg-background-paper">
                <Heading title='Counseling Service' description='Providing personalized guidance and support for students.' />
            </div>
        </>
    );
}

export default CounselingHeader;
