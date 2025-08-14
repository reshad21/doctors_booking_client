/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetDisplayNoticeQuery } from "@/redux/api/message/message";

const NoticeFooter = () => {
  const {
    data: noticeData,
    isLoading,
    isError,
  } = useGetDisplayNoticeQuery({
    filter: JSON.stringify({ status: "ACTIVE" }),
  });

  let content;

  if (isLoading) {
    // Loading shimmer (keeps layout consistent)
    content = (
      <p className="whitespace-nowrap animate-pulse opacity-60">
        Loading notice...
      </p>
    );
  } else if (isError) {
    // Silent fallback to avoid breaking layout
    content = <p className="opacity-50">Notice unavailable</p>;
  } else if (!noticeData?.data?.length) {
    // No notice data
    content = <p className="opacity-50">No notices at the moment</p>;
  } else {
    content = (
      <p className="marquee whitespace-nowrap">
        {noticeData.data
          .map((notice: any) => notice.description)
          .join("   •   ")}{" "}
      </p>
    );
  }

  return (
    <footer className="bg-[#042F16] py-3 px-6 text-white text-center text-lg border-t border-gray-300 overflow-hidden">
      <div className="relative w-full overflow-hidden">{content}</div>
      <style>
        {`
    .marquee {
      display: inline-block;
      padding-left: 100%;
      animation: scroll-left 30s linear infinite;
    }
    @keyframes scroll-left {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-100%); }
    }
  `}
      </style>
    </footer>
  );
};

export default NoticeFooter;
