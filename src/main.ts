import { HOLIDAYS } from "./config";

const LINE_TOKEN =
  PropertiesService.getScriptProperties().getProperty("LINE_TOKEN");

/** APIから日本の祝日を取得 */
const getHolidays = (): Date[] =>
  Object.keys(HOLIDAYS).map((holiday_str) => new Date(holiday_str));

/** 日付の比較 */
const cmpDate = (date1: Date, date2: Date) => {
  if (date1.getFullYear() !== date2.getFullYear()) return false;
  if (date1.getMonth() !== date2.getMonth()) return false;
  if (date1.getDate() !== date2.getDate()) return false;

  return true;
};

/** その日が休みかどうか */
const isHoliday = (date: Date, holidays: Date[]) => {
  if (date.getDay() == 6) return true;
  if (date.getDay() == 0) return true;

  for (const holiday of holidays) {
    if (cmpDate(date, holiday)) return true;
  }
  return false;
};

/** 次の日が休みかどうか */
const isHolidayNextDate = (date: Date, holidays: Date[]) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  /** 土曜日 */
  if (date.getDay() == 6) return true;
  /** 連休 */
  if (isHoliday(date, holidays) && isHoliday(nextDate, holidays)) return true;

  return false;
};

/** 予約済みの日を取得 */
const getReservedDate = (
  reservedDatesCell: GoogleAppsScript.Spreadsheet.Range
): Date[] => {
  const reservedDatesStr: string = reservedDatesCell.getValue();

  const reservedDates = reservedDatesStr
    .split("\n")
    .map((v: string) => new Date(v));

  return reservedDates;
};

/** 予約済みの日かどうか */
const isReservedDate = (date: Date, reservedDates: Date[]) => {
  for (const reserved of reservedDates) {
    if (cmpDate(date, reserved)) return true;
  }
  return false;
};

export function myFunction() {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName("hoge");
  if (!sheet) return;
  const isActiveCell = sheet.getRange(1, 1);
  const startDateCell = sheet.getRange(2, 2);
  const reservedDatesCell = sheet.getRange(3, 2);

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

  /** 祝日を取得 */
  const holidays = getHolidays();
  const reservedDates = getReservedDate(reservedDatesCell);

  const caledersData = JSON.parse(res.getContentText());
  const calendarsSiteDateList = caledersData.calendarsSiteDateList;

  /**  */
  const campStayDataList = calendarsSiteDateList.filter(
    (data: any) => data.siteGroupCd == "01" && data.stayDiv == "STAY"
  );

  /**  */
  const ikeruData = campStayDataList.filter((data: any) => {
    const date = new Date(data.calDate);

    if (startDate && date < startDate) return false;

    /** 連休の日付 & 未予約の日付 & 枠が残っているか */
    return (
      isHolidayNextDate(date, holidays) &&
      !isReservedDate(date, reservedDates) &&
      data.remainCount > 0
    );
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
