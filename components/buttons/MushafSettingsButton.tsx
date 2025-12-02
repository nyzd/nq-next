"use client";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { useMushafOptions } from "@/contexts/mushafOptionsContext";
import { SelectTranslation } from "../inputs/SelectTranslation";
import { PaginatedTranslationListList } from "@ntq/sdk";
import { Symbol } from "@yakad/symbols";
import { ChangeThemeButton } from "./ChangeThemeButton";
import { useWindowSize } from "../useWindowSize";
import { Separator } from "../ui/separator";

export function MushafSettingsButton({
    translations,
}: {
    translations: PaginatedTranslationListList;
}) {
    const [mushafOptions, setMushafOptions] = useMushafOptions();
    const [windowWidth] = useWindowSize();

    const handleSelectChange = (name: string, value: string) => {
        setMushafOptions((prev) => ({ ...prev, [name]: value }));
    };
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Settings">
                    <Symbol icon="settings" />
                </Button>
            </SheetTrigger>
            <SheetContent
                className="overflow-y-auto"
                side={windowWidth <= 800 ? "bottom" : "right"}
            >
                <SheetHeader className="flex flex-row">
                    <Symbol icon="settings" />
                    <SheetTitle>Settings</SheetTitle>
                </SheetHeader>

                <div className="space-y-6 p-7">
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">
                            <Symbol icon="match_case" />
                            Arabic Text
                        </Label>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="arabicFont" className="text-sm">
                                    <Symbol icon="brand_family" />
                                    Font
                                </Label>
                                <Select
                                    value={"tahoma"}
                                    onValueChange={(value) =>
                                        handleSelectChange("arabicFont", value)
                                    }
                                >
                                    <SelectTrigger id="arabicFont">
                                        <SelectValue placeholder="Font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tahoma">
                                            Tahoma
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="arabicFontSize"
                                    className="text-sm"
                                >
                                    <Symbol icon="format_size" />
                                    Font size
                                </Label>
                                <Select
                                    value={mushafOptions.arabicFontSize}
                                    onValueChange={(value) =>
                                        handleSelectChange(
                                            "arabicFontSize",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger id="arabicFontSize">
                                        <SelectValue placeholder="Font size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">
                                            Small
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="large">
                                            Large
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="textAlign" className="text-sm">
                                    <Symbol icon="article" />
                                    Text align
                                </Label>
                                <Select
                                    value={mushafOptions.textAlign}
                                    onValueChange={(value) =>
                                        handleSelectChange("textAlign", value)
                                    }
                                >
                                    <SelectTrigger id="textAlign">
                                        <SelectValue placeholder="Text align" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">
                                            <Symbol icon="format_align_right" />
                                            Normal
                                        </SelectItem>
                                        <SelectItem value="center">
                                            <Symbol icon="format_align_center" />
                                            Center
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label className="text-base font-semibold">
                            <Symbol icon="translate" />
                            Translate
                        </Label>

                        <SelectTranslation translations={translations} />

                        <div className="space-y-2">
                            <Label
                                htmlFor="translationFontSize"
                                className="text-sm"
                            >
                                Translation Font size
                            </Label>
                            <Select
                                value={mushafOptions.translationFontSize}
                                onValueChange={(value) =>
                                    handleSelectChange(
                                        "translationFontSize",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger id="translationFontSize">
                                    <SelectValue placeholder="Translation Font size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">
                            <Symbol icon="colors" />
                            Theme
                        </Label>
                        <ChangeThemeButton />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
