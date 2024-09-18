import {
  Card,
  Form,
  theme as antdTheme,
  Input,
  Radio,
  RadioChangeEvent,
  Slider,
  Button,
} from 'antd';
import { ThemeConfig } from '../../atoms/root';
import React, { useId } from 'react';
import { debounce } from 'lodash-es';
import { useAuth } from '../../hooks/useAuth';
import { updateThemeConfig } from '../../services/auth';
import { ServiceErrorManager } from '../../../helpers/service';
import { useParams } from 'react-router-dom';
import { ReloadOutlined } from '@ant-design/icons';
const Setting = () => {
  const { theme, setThemConfig } = useAuth();
  const { id: userId } = useParams();
  const [saving, setSaving] = React.useState(false);
  const update = (newTheme: ThemeConfig) => {
    setThemConfig({
      ...(theme || {}),
      ...(newTheme || {}),
      token: {
        ...(theme.token || {}),
        ...(newTheme.token || {}),
      },
    });
    localStorage.setItem(
      'themeConfig',
      JSON.stringify({
        ...(theme || {}),
        ...(newTheme || {}),
        token: {
          ...(theme.token || {}),
          ...(newTheme.token || {}),
        },
      })
    );
  };

  const onThemeChange = (mode: 'DARK' | 'LIGHT') => {
    update({ mode });
  };

  const onReset = () => {
    setThemConfig({
      ...theme,
      mode: 'LIGHT',
      isCompact: false,
      token: {},
    });
  };

  const onBorderRadiusChange = (borderRadius: number | null) => {
    update({ token: { borderRadius: borderRadius || 0 } });
  };
  const onCompactChange = ({
    target: { value: isCompact },
  }: RadioChangeEvent) => {
    update({ isCompact: !!isCompact });
  };
  const onPrimColorChange = debounce((colorPrimary: string) => {
    update({ token: { colorPrimary } });
  }, 80);

  const onSave = async () => {
    setSaving(true);
    const [err, data] = await ServiceErrorManager(
      updateThemeConfig({
        data: {
          payload: { ...theme },
          query: { userId: userId },
        },
      }),
      {
        successMessage: 'Theme setting updated successfully',
        failureMessage: 'Error while save Theme settings',
      }
    );
    if (err || !data) return;
    setSaving(false);
  };

  const isCompact = !!theme?.isCompact;
  const primaryColor =
    theme?.token?.colorPrimary || antdTheme?.defaultSeed?.colorPrimary;
  const borderRadius =
    theme?.token?.borderRadius || antdTheme?.defaultSeed?.borderRadius;
  return (
    <Card className=" w-full h-full">
      <Form layout="vertical" onFinish={onSave} className="w-80">
        <Form.Item label="Display Size">
          <Radio.Group
            value={isCompact}
            options={[
              { value: false, label: 'Default' },
              { value: true, label: 'Compact' },
            ]}
            onChange={onCompactChange}
          />
        </Form.Item>
        <Form.Item label="Choose Theme">
          <div className="flex flex-row items-center space-x-4">
            <div
              className="w-16 h-16 all-center text-center  place-content-center cursor-pointer bg-slate-200 text-zinc-800"
              onClick={() => onThemeChange('LIGHT')}
              style={{ borderRadius }}
            >
              <span>Light</span>
            </div>
            {!isCompact && (
              <div
                className="w-16 h-16 all-center text-center place-content-center cursor-pointer bg-zinc-800 text-slate-200"
                onClick={() => onThemeChange('DARK')}
                style={{ borderRadius }}
              >
                <span>Dark</span>
              </div>
            )}
          </div>
        </Form.Item>
        <Form.Item label="Primary Color">
          <Input
            value={primaryColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onPrimColorChange(e?.target?.value)
            }
            suffix={
              <Input
                type="color"
                value={primaryColor}
                onChange={(e) => onPrimColorChange(e.target.value)}
                style={{ backgroundColor: primaryColor }}
                className="w-8 h-8"
              />
            }
          />
        </Form.Item>
        <Form.Item label="Border Radius">
          <Slider
            min={1}
            max={20}
            trackStyle={{ background: primaryColor }}
            handleStyle={{
              border: `1px 1px solid ${primaryColor}`,
            }}
            onChange={onBorderRadiusChange}
            value={borderRadius}
          />
        </Form.Item>
        <div className="flex mt-4 flex-row items-center justify-end space-x-2">
          <Button type="link" onClick={onReset}>
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ReloadOutlined spin={saving} />}
            loading={saving}
          >
            Save
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Setting;
