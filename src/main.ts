import { isHolidayByDate } from "./isHoliday";

const LINE_TOKEN = "XnXlJBT3ECVXRNJd8ERL7tTPA8fnmw9WfYL4eZHBDtY";

export function myFunction() {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName("hoge");
  if (!sheet) return;
  const isActiveCell = sheet.getRange(1, 1);
  const startDateCell = sheet.getRange(2, 2);

  /** スプレットシート1列目 チェックされているか */
  const isActive = isActiveCell.getValue();

  /** スプレットシート2列目 開始日 */
  const startDate = startDateCell.getValue()
    ? new Date(startDateCell.getValue())
    : null;

  if (!isActive) return;

  const res = UrlFetchApp.fetch(
    "https://reserve.fumotoppara.net/api/shared/reserve/calendars",
    {
      headers: {
        "X-Api-Key": "51ff85fe-ca21-4a42-f8cc-cf5f34b964e5",
      },
    }
  );

  const caledersData = JSON.parse(res.getContentText());
  const calendarsSiteDateList = caledersData.calendarsSiteDateList;

  /**  */
  const campStayDataList = calendarsSiteDateList.filter(
    (data: any) => data.siteGroupCd == "01" && data.stayDiv == "STAY"
  );

  /**  */
  const ikeruData = campStayDataList.filter((data: any) => {
    const date = new Date(data.calDate);
    const nextDay = new Date(data.calDate);
    nextDay.setDate(nextDay.getDate() + 1);

    if (startDate && date < startDate) return false;

    /** 連休を取得 */
    const isHoliday =
      date.getDay() == 6 ||
      ((isHolidayByDate(date) || date.getDay() == 0) &&
        isHolidayByDate(nextDay));

    return isHoliday && data.remainCount > 0;
    // return isHoliday;
  });

  if (!ikeruData.length) return;

  let message = "URL:https://reserve.fumotoppara.net/";

  ikeruData.map((data: any) => {
    message += `\n${data.calDate}: ${data.remainCount}`;
  });

  const options: any = {
    method: "post",
    payload: { message: message },
    headers: { Authorization: "Bearer " + LINE_TOKEN },
  };

  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
